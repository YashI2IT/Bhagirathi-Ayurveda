// Override DNS — ISP's DNS can't resolve MongoDB Atlas SRV records
require('dns').setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const { connectDB } = require('./config/database');
const { seedAdminFromEnv } = require('./config/seedAdmin');
const errorHandler = require('./middleware/errorHandler');
const { sanitizeInput, preventNoSQLInjection, validateContentType } = require('./middleware/sanitize');
const { languageMiddleware } = require('./middleware/language');
const setupCronJobs = require('./config/cron');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().then(async () => {
  try {
    await seedAdminFromEnv();
  } catch (e) {
    console.error('Admin seed error:', e.message);
  }
});

// Security middleware - Helmet with enhanced configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Allow embedding for development
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

// Prevent HTTP Parameter Pollution
app.use(hpp());

// General rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 login attempts per windowMs
  message: {
    success: false,
    error: {
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      message: 'Too many login attempts, please try again after 15 minutes'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful logins
});

// Apply general rate limiting
app.use(generalLimiter);

// CORS configuration with enhanced security
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? (process.env.ALLOWED_ORIGINS || 'https://your-domain.com').split(',')
  : ['http://localhost:1234', 'http://localhost:3000', 'http://127.0.0.1:1234', 'http://127.0.0.1:3000'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In development, allow any localhost origin
    if (process.env.NODE_ENV !== 'production') {
      if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        return callback(null, true);
      }
    }
    
    // In production, allow Vercel preview deployments
    if (process.env.NODE_ENV === 'production') {
      // Allow all Vercel deployments (production and preview)
      if (origin.includes('.vercel.app')) {
        return callback(null, true);
      }
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept-Language'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
  maxAge: 86400 // 24 hours
}));

// Body parsing middleware with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization middleware
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(preventNoSQLInjection); // Additional NoSQL injection prevention
app.use(sanitizeInput); // XSS prevention

// Validate content type for API requests
app.use('/api', validateContentType);
// Multi-language parsing middleware
app.use('/api', languageMiddleware);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Bhagarathi Ayurveda API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API Routes with specific rate limiting for auth
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/user-auth', authLimiter, require('./routes/userAuth')); // User authentication routes
app.use('/api/admin', require('./routes/admin'));
app.use('/api/public', require('./routes/public'));
app.use('/api/user', require('./routes/user')); // User specific routes

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found'
    }
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server only if this file is run directly (not imported)
if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    // Start background processing
    setupCronJobs();
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
      console.log('Process terminated');
    });
  });
}

module.exports = app;