# Quick Start: Deploy to Render

## 🚀 5-Minute Deployment Guide

### Step 1: Go to Render
Visit: https://dashboard.render.com

### Step 2: Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect repository: **YashI2IT/Bhagirathi-Ayurveda**

### Step 3: Configure Service

```
Name: bhagirathi-ayurveda-backend
Region: Oregon (US West)
Branch: main
Root Directory: backend          ⚠️ IMPORTANT!
Runtime: Node
Build Command: npm install
Start Command: npm start
Instance Type: Free
```

### Step 4: Add Environment Variables

Copy and paste these (update values!):

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
REDIS_URL=redis://default:password@host:port
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FRONTEND_URL=https://your-app.vercel.app
APP_URL=https://your-app.vercel.app
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
GEMINI_API_KEY=AIzaSy...your-key
```

### Step 5: Deploy
Click **"Create Web Service"** and wait 2-5 minutes

### Step 6: Test Backend
Visit: `https://your-service.onrender.com/health`

Should see:
```json
{"success": true, "message": "Bhagarathi Ayurveda API is running"}
```

### Step 7: Update Frontend
1. Go to Vercel Dashboard
2. Settings → Environment Variables
3. Add: `REACT_APP_API_URL=https://your-service.onrender.com`
4. Redeploy frontend

### Step 8: Test Chatbot
Visit your live site and click the chatbot icon!

## ✅ Done!

Your full-stack app is now live:
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
- Cache: Redis Cloud
- AI: Google Gemini

## 🆘 Quick Troubleshooting

**Build fails?**
→ Check "Root Directory" is set to `backend`

**Can't connect to MongoDB?**
→ Whitelist IP `0.0.0.0/0` in MongoDB Atlas

**Chatbot not working?**
→ Verify `GEMINI_API_KEY` is correct

**CORS errors?**
→ Add your Vercel URL to CORS whitelist in backend

## 📚 Full Guide
See `RENDER-DEPLOYMENT.md` for detailed instructions
