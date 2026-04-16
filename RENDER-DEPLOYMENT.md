# Deploy Backend to Render (Without YAML)

This guide will help you deploy your Node.js backend to Render using the web dashboard.

## Prerequisites

- ✅ GitHub repository with your code pushed
- ✅ Render account (sign up at https://render.com)
- ✅ MongoDB Atlas connection string
- ✅ Redis Cloud connection string
- ✅ Gemini API key
- ✅ Cloudinary credentials
- ✅ SMTP credentials for email

## Step-by-Step Deployment

### 1. Create a New Web Service on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** button in the top right
3. Select **"Web Service"**

### 2. Connect Your Repository

1. Click **"Connect a repository"**
2. If first time, authorize Render to access your GitHub
3. Find and select: **YashI2IT/Bhagirathi-Ayurveda**
4. Click **"Connect"**

### 3. Configure the Web Service

Fill in the following settings:

#### Basic Settings:
- **Name**: `bhagirathi-ayurveda-backend` (or any name you prefer)
- **Region**: Choose closest to your users (e.g., Oregon, Frankfurt, Singapore)
- **Branch**: `main`
- **Root Directory**: `backend` ⚠️ **IMPORTANT!**
- **Runtime**: `Node`
- **Build Command**: `npm install` (or leave empty)
- **Start Command**: `npm start`

#### Instance Type:
- Select **"Free"** (or paid plan if you need more resources)
- Free tier includes:
  - 512 MB RAM
  - Shared CPU
  - Sleeps after 15 min of inactivity
  - 750 hours/month free

### 4. Add Environment Variables

Click **"Advanced"** and then **"Add Environment Variable"**. Add ALL of these:

```
NODE_ENV=production
PORT=10000

# MongoDB Atlas
MONGODB_URI=your_mongodb_connection_string_here

# Redis Cloud
REDIS_URL=your_redis_connection_string_here

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@bhagarathi-ayurveda.com
ADMIN_PASSWORD=your_secure_admin_password

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_gmail_app_password

# Frontend URL (Update after Vercel deployment)
FRONTEND_URL=https://your-vercel-app.vercel.app
APP_URL=https://your-vercel-app.vercel.app

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here
```

⚠️ **IMPORTANT**: Replace all placeholder values with your actual credentials!

### 5. Deploy

1. Click **"Create Web Service"** at the bottom
2. Render will start building and deploying your backend
3. Wait for the build to complete (usually 2-5 minutes)
4. You'll see "Live" with a green dot when ready

### 6. Get Your Backend URL

Once deployed, you'll get a URL like:
```
https://bhagirathi-ayurveda-backend.onrender.com
```

### 7. Test Your Backend

Open these URLs in your browser:

1. **Health Check**:
   ```
   https://your-backend-url.onrender.com/health
   ```
   Should return:
   ```json
   {
     "success": true,
     "message": "Bhagarathi Ayurveda API is running",
     "timestamp": "...",
     "environment": "production"
   }
   ```

2. **Test Chatbot** (using curl or Postman):
   ```bash
   curl -X POST https://your-backend-url.onrender.com/api/public/chat \
     -H "Content-Type: application/json" \
     -d '{"message":"What is Ayurveda?"}'
   ```

### 8. Update Frontend Environment Variable

Now update your Vercel frontend to use the new backend URL:

1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add or update:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com
   ```
5. Redeploy your frontend

### 9. Update CORS in Backend (if needed)

If you get CORS errors, update `backend/server.js`:

```javascript
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [
      'https://your-vercel-app.vercel.app',
      'https://bhagirathi-ayurveda.vercel.app'
    ]
  : ['http://localhost:1234', 'http://localhost:3000'];
```

Then commit and push to trigger a new deployment.

## Troubleshooting

### Build Fails

**Error**: "Cannot find module"
- **Solution**: Make sure `Root Directory` is set to `backend`

**Error**: "npm install failed"
- **Solution**: Check if package.json is valid
- Try clearing build cache in Render settings

### Service Won't Start

**Error**: "Application failed to respond"
- **Solution**: Check logs in Render dashboard
- Verify `PORT` environment variable is set to `10000`
- Make sure `npm start` command is correct

### MongoDB Connection Failed

**Error**: "MongoServerError: Authentication failed"
- **Solution**: 
  1. Check MongoDB Atlas connection string
  2. Verify IP whitelist includes `0.0.0.0/0` (allow all)
  3. Check username/password are correct

### Redis Connection Failed

**Error**: "Redis connection refused"
- **Solution**:
  1. Verify Redis Cloud connection string
  2. Check Redis database is active
  3. Ensure connection string includes password

### Chatbot Not Working

**Error**: "AI Chat integration is not configured properly"
- **Solution**: Verify `GEMINI_API_KEY` is set correctly

**Error**: 404 on chatbot endpoint
- **Solution**: Check backend logs for errors
- Verify routes are properly configured

### Free Tier Limitations

**Issue**: Service sleeps after 15 minutes
- **Solution**: 
  - Upgrade to paid plan ($7/month)
  - Or use a service like UptimeRobot to ping your API every 14 minutes

**Issue**: Slow cold starts
- **Solution**: This is normal for free tier (can take 30-60 seconds)
- Upgrade to paid plan for instant response

## Monitoring & Logs

### View Logs:
1. Go to your service in Render dashboard
2. Click **"Logs"** tab
3. See real-time logs of your application

### View Metrics:
1. Click **"Metrics"** tab
2. See CPU, memory, and bandwidth usage

### Set Up Alerts:
1. Go to **Settings** → **Notifications**
2. Add email or Slack webhook
3. Get notified of deployment failures or crashes

## Updating Your Backend

### Automatic Deployments:
Render automatically deploys when you push to the `main` branch:

```bash
git add .
git commit -m "Update backend"
git push origin main
```

Render will detect the push and redeploy automatically.

### Manual Deployments:
1. Go to your service in Render dashboard
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

### Rollback:
1. Go to **"Events"** tab
2. Find a previous successful deployment
3. Click **"Rollback to this version"**

## Environment Variables Management

### Add New Variable:
1. Go to **"Environment"** tab
2. Click **"Add Environment Variable"**
3. Enter key and value
4. Click **"Save Changes"**
5. Service will automatically redeploy

### Update Variable:
1. Go to **"Environment"** tab
2. Click on the variable to edit
3. Update the value
4. Click **"Save Changes"**

### Delete Variable:
1. Go to **"Environment"** tab
2. Click the trash icon next to the variable
3. Confirm deletion

## Cost Optimization

### Free Tier:
- ✅ 750 hours/month free
- ✅ Enough for 1 service running 24/7
- ⚠️ Sleeps after 15 min inactivity
- ⚠️ 512 MB RAM limit

### Paid Plans:
- **Starter**: $7/month
  - No sleep
  - 512 MB RAM
  - Better for production
  
- **Standard**: $25/month
  - 2 GB RAM
  - Better performance

## Security Best Practices

1. ✅ Never commit `.env` file to Git
2. ✅ Use strong passwords for admin account
3. ✅ Rotate JWT_SECRET regularly
4. ✅ Keep dependencies updated
5. ✅ Monitor logs for suspicious activity
6. ✅ Use HTTPS only (Render provides this automatically)
7. ✅ Whitelist only necessary IPs in MongoDB Atlas (if possible)

## Backup & Recovery

### Database Backups:
- MongoDB Atlas automatically backs up your data
- Configure backup schedule in Atlas dashboard

### Code Backups:
- Your code is in GitHub (already backed up)
- Render keeps deployment history

### Environment Variables Backup:
- Keep a secure copy of all environment variables
- Store in password manager or secure notes

## Performance Tips

1. **Enable Compression**: Already enabled via Express middleware
2. **Use Redis Caching**: Already configured for sessions
3. **Optimize Database Queries**: Add indexes in MongoDB
4. **Monitor Response Times**: Use Render metrics
5. **Upgrade Plan**: If free tier is too slow

## Support

### Render Support:
- Documentation: https://render.com/docs
- Community: https://community.render.com
- Email: support@render.com

### Your Backend Issues:
- Check logs first
- Review environment variables
- Test endpoints individually
- Check MongoDB/Redis connectivity

## Success Checklist

After deployment, verify:

- ✅ Backend URL is accessible
- ✅ `/health` endpoint returns success
- ✅ MongoDB connection works
- ✅ Redis connection works
- ✅ Chatbot API responds correctly
- ✅ Admin login works
- ✅ File uploads work (Cloudinary)
- ✅ Email sending works
- ✅ CORS allows frontend requests
- ✅ All environment variables are set
- ✅ Frontend can communicate with backend

## Next Steps

1. Deploy backend to Render (follow steps above)
2. Get backend URL
3. Update frontend `REACT_APP_API_URL` in Vercel
4. Redeploy frontend
5. Test chatbot on live site
6. Seed chatbot context (if needed)
7. Monitor logs and performance

Your backend will be live at:
```
https://your-service-name.onrender.com
```

Good luck with your deployment! 🚀
