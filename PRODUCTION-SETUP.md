# Production Setup Guide

Complete guide to configure your application for production deployment.

## 🚀 Quick Setup Checklist

### 1. Render Backend Environment Variables

Go to your Render service → Environment tab and add these variables:

```env
# Environment
NODE_ENV=production
PORT=10000

# MongoDB Atlas
MONGODB_URI=mongodb+srv://Yash-Kajal_2576:ypb192576@ac-d0zyh4q-shard-00-00.kgd4fiu.mongodb.net:27017,ac-d0zyh4q-shard-00-01.kgd4fiu.mongodb.net:27017,ac-d0zyh4q-shard-00-02.kgd4fiu.mongodb.net:27017/bhagarathi-ayurveda?ssl=true&replicaSet=atlas-qjen3t-shard-0&authSource=admin&retryWrites=true&w=majority

# Redis Cloud
REDIS_URL=redis://default:cYOwA38hNyJVczciNcwBqL3rwobJRqwy@redis-10665.c240.us-east-1-3.ec2.cloud.redislabs.com:10665

# JWT Configuration
JWT_SECRET=bhagarathi-ayurveda-super-secret-jwt-key-2024-production
JWT_EXPIRES_IN=24h

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@bhagarathi-ayurveda.com
ADMIN_PASSWORD=SecurePassword123!

# Email Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=yashborade072@gmail.com
SMTP_PASSWORD=mjtldszgtzynijlb

# Frontend URLs (Update with your actual Vercel URL)
FRONTEND_URL=https://bhagirathi-ayurveda.vercel.app
APP_URL=https://bhagirathi-ayurveda.vercel.app

# CORS Allowed Origins (comma-separated, no spaces)
ALLOWED_ORIGINS=https://bhagirathi-ayurveda.vercel.app,https://www.bhagirathi-ayurveda.com

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dig8ec5rl
CLOUDINARY_API_KEY=546115169759517
CLOUDINARY_API_SECRET=reyDatqGTbiA5R4iOW0ncxqNqTQ

# Google Gemini AI
GEMINI_API_KEY=AIzaSyAtZkmGDM1GGJJc2KeQhqhqwrx0tUNmYUw
```

### 2. Vercel Frontend Environment Variables

Go to Vercel Dashboard → Your Project → Settings → Environment Variables:

```env
REACT_APP_API_URL=https://bhagirathi-ayurveda.onrender.com
```

### 3. Update MongoDB Atlas Network Access

1. Go to MongoDB Atlas Dashboard
2. Click **Network Access** in the left sidebar
3. Click **"Add IP Address"**
4. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
5. Click **"Confirm"**

This allows Render to connect to your database.

### 4. Verify Email Configuration

Your email verification will work with these settings:

**Gmail App Password Setup:**
1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Go to App Passwords
4. Generate new app password for "Mail"
5. Use this password in `SMTP_PASSWORD`

**Email Templates:**
- Verification emails will be sent from: `yashborade072@gmail.com`
- Users will receive verification links like:
  ```
  https://bhagirathi-ayurveda.vercel.app/verify-email?token=...
  ```

## 🔧 Configuration Details

### CORS Configuration

Your backend is configured to accept requests from:
- Production: URLs in `ALLOWED_ORIGINS` environment variable
- Development: localhost:1234, localhost:3000

**Important:** Make sure `ALLOWED_ORIGINS` includes:
- Your Vercel deployment URL
- Any custom domain you use
- Separate multiple URLs with commas (no spaces)

Example:
```
ALLOWED_ORIGINS=https://bhagirathi-ayurveda.vercel.app,https://www.yourdomain.com
```

### Email Verification Flow

1. **User Registers** → Backend sends verification email
2. **User Clicks Link** → Redirects to frontend `/verify-email?token=...`
3. **Frontend Calls API** → Backend verifies token
4. **Account Activated** → User can login

**Email Link Format:**
```
${FRONTEND_URL}/verify-email?token=${verificationToken}
```

### Password Reset Flow

1. **User Requests Reset** → Backend sends reset email
2. **User Clicks Link** → Redirects to frontend `/reset-password/${token}`
3. **User Enters New Password** → Frontend calls API
4. **Password Updated** → User can login with new password

**Reset Link Format:**
```
${FRONTEND_URL}/reset-password/${resetToken}
```

## 🧪 Testing Production Setup

### 1. Test Backend Health

```bash
curl https://bhagirathi-ayurveda.onrender.com/health
```

Expected response:
```json
{
  "success": true,
  "message": "Bhagarathi Ayurveda API is running",
  "timestamp": "2026-04-16T14:00:00.000Z",
  "environment": "production"
}
```

### 2. Test User Registration

```bash
curl -X POST https://bhagirathi-ayurveda.onrender.com/api/user-auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Registration successful. Please check your email to verify your account.",
  "data": {
    "userId": "...",
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

### 3. Test Chatbot

```bash
curl -X POST https://bhagirathi-ayurveda.onrender.com/api/public/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What is Ayurveda?"}'
```

Expected response:
```json
{
  "success": true,
  "data": "Hello there!\n\nAyurveda is an ancient holistic healing system..."
}
```

### 4. Test Email Verification

1. Register a new user with your real email
2. Check your inbox for verification email
3. Click the verification link
4. Should redirect to your Vercel app
5. Account should be verified

### 5. Test Frontend-Backend Connection

1. Visit your Vercel app: https://bhagirathi-ayurveda.vercel.app
2. Click chatbot icon
3. Send a message
4. Should receive AI response

## 🔒 Security Checklist

- ✅ `NODE_ENV=production` set in Render
- ✅ Strong `JWT_SECRET` (different from development)
- ✅ Strong admin password
- ✅ Gmail app password (not regular password)
- ✅ MongoDB Atlas IP whitelist configured
- ✅ Redis connection secured
- ✅ CORS properly configured
- ✅ Rate limiting enabled
- ✅ Input sanitization active
- ✅ Helmet security headers enabled

## 📧 Email Troubleshooting

### Emails Not Sending

**Check:**
1. `SMTP_USER` is correct Gmail address
2. `SMTP_PASSWORD` is app password (not regular password)
3. 2-Step Verification is enabled on Gmail
4. Check Render logs for email errors

**Test Email Manually:**
```javascript
// In Render shell or locally
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'yashborade072@gmail.com',
    pass: 'mjtldszgtzynijlb'
  }
});

transporter.sendMail({
  from: 'yashborade072@gmail.com',
  to: 'your-test-email@example.com',
  subject: 'Test Email',
  text: 'This is a test email'
}, (err, info) => {
  if (err) console.error('Error:', err);
  else console.log('Success:', info);
});
```

### Verification Links Not Working

**Check:**
1. `FRONTEND_URL` matches your Vercel deployment URL
2. Frontend has `/verify-email` route configured
3. Token is being passed correctly in URL
4. Token hasn't expired (check expiration time)

## 🚨 Common Issues & Solutions

### Issue: CORS Error

**Symptom:** Browser console shows "CORS policy" error

**Solution:**
1. Add your Vercel URL to `ALLOWED_ORIGINS` in Render
2. Format: `https://your-app.vercel.app` (no trailing slash)
3. Multiple URLs: separate with commas, no spaces
4. Redeploy backend after changing

### Issue: Chatbot Not Responding

**Symptom:** Chatbot shows "Unable to connect to server"

**Solution:**
1. Check `REACT_APP_API_URL` in Vercel is correct
2. Verify backend is running (check /health endpoint)
3. Check `GEMINI_API_KEY` is set in Render
4. Check Render logs for errors

### Issue: User Can't Login After Verification

**Symptom:** Email verified but login fails

**Solution:**
1. Check MongoDB connection
2. Verify user document in database
3. Check `isVerified` field is true
4. Try password reset flow

### Issue: Render Service Sleeping

**Symptom:** First request takes 30-60 seconds

**Solution:**
- This is normal for free tier
- Service sleeps after 15 minutes of inactivity
- Upgrade to paid plan ($7/month) for always-on service
- Or use UptimeRobot to ping every 14 minutes

## 📊 Monitoring

### Render Dashboard

**Logs:**
- View real-time logs
- Filter by error/warning
- Download logs for analysis

**Metrics:**
- CPU usage
- Memory usage
- Request count
- Response times

**Events:**
- Deployment history
- Service restarts
- Configuration changes

### MongoDB Atlas

**Metrics:**
- Connection count
- Operations per second
- Storage usage
- Network traffic

**Alerts:**
- Set up email alerts
- Monitor connection issues
- Track slow queries

### Email Monitoring

**Check:**
- Email delivery rate
- Bounce rate
- Spam complaints
- Gmail sending limits (500/day)

## 🔄 Deployment Workflow

### Making Changes

1. **Update Code Locally**
   ```bash
   # Make your changes
   git add .
   git commit -m "Your changes"
   ```

2. **Push to GitHub**
   ```bash
   git push origin main
   ```

3. **Automatic Deployment**
   - Render detects push
   - Builds and deploys automatically
   - Takes 2-5 minutes

4. **Verify Deployment**
   - Check Render logs
   - Test /health endpoint
   - Test changed functionality

### Environment Variable Changes

1. Update in Render dashboard
2. Service automatically redeploys
3. No code push needed

### Rollback if Needed

1. Go to Render → Events
2. Find previous successful deployment
3. Click "Rollback to this version"

## 📝 Production Checklist

Before going live:

- [ ] All environment variables set in Render
- [ ] `REACT_APP_API_URL` set in Vercel
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Email sending tested and working
- [ ] User registration flow tested
- [ ] Email verification tested
- [ ] Password reset tested
- [ ] Admin login tested
- [ ] Chatbot tested
- [ ] File uploads tested (Cloudinary)
- [ ] All API endpoints tested
- [ ] CORS working correctly
- [ ] SSL/HTTPS working
- [ ] Custom domain configured (if applicable)
- [ ] Monitoring set up
- [ ] Backup strategy in place

## 🎯 Next Steps

1. ✅ Complete this production setup
2. ✅ Test all features thoroughly
3. ✅ Seed chatbot context data
4. ✅ Create admin account
5. ✅ Add initial content (blogs, testimonials, etc.)
6. ✅ Configure custom domain (optional)
7. ✅ Set up monitoring and alerts
8. ✅ Document any custom configurations
9. ✅ Train team on admin panel
10. ✅ Launch! 🚀

## 📞 Support

If you encounter issues:

1. Check Render logs first
2. Verify all environment variables
3. Test individual components
4. Check MongoDB/Redis connectivity
5. Review this guide
6. Contact support if needed

Your application is now ready for production! 🎉
