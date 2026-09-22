# Railway Deployment Guide for SmartLearn

## 🚀 Deploy SmartLearn to Railway

Railway is an excellent platform for deploying MERN applications. Here's how to deploy your SmartLearn project.

## 📋 Prerequisites

- GitHub account (your code is already there: https://github.com/mandeep25-code/AI-Powered-Smart-Learning-Platform.git)
- Railway account (free tier available)
- MongoDB Atlas account (or use Railway's MongoDB)

## 🎯 Deployment Steps

### Step 1: Create Railway Account

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"

### Step 2: Deploy Backend

**Option A: Use Railway's MongoDB (Recommended - Free)**

1. In Railway, click **"New Project"** → **"Deploy from GitHub repo"**
2. Select your repository: `mandeep25-code/AI-Powered-Smart-Learning-Platform`
3. Click **"Deploy Now"**

4. **Add MongoDB Service:**
   - Click **"New Service"** → **"Database"** → **"MongoDB"**
   - Railway will create a free MongoDB instance
   - Wait for it to be ready (takes 1-2 minutes)

5. **Configure Backend:**
   - Click on your backend service
   - Go to **"Variables"** tab
   - Add these environment variables:
     ```
     MONGO_URL = (Click "MongoDB" service → "Connect" → Copy connection string)
     DB_NAME = smartlearn
     JWT_SECRET = (Generate a random string: use 32+ characters)
     PORT = 8001
     CORS_ORIGINS = https://your-frontend-url.railway.app
     OPENROUTER_API_KEY = your_openrouter_api_key
     OPENROUTER_MODEL = openrouter/free
     RAZORPAY_KEY_ID = your_razorpay_key_id
     RAZORPAY_KEY_SECRET = your_razorpay_key_secret
     ```

6. **Update MongoDB Connection:**
   - Go to MongoDB service in Railway
   - Click **"Connect"** → Copy the connection string
   - Paste it as `MONGO_URL` in backend variables
   - It should look like: `mongodb://mongo:password@mongo.railway.app:port/railway`

7. **Configure Build Settings:**
   - In backend service, go to **"Settings"** tab
   - Set **Root Directory**: `backend`
   - Build Command: `npm install`
   - Start Command: `node server.js`

**Option B: Use Your Own MongoDB Atlas**

1. Follow the same steps as above, but:
   - Skip adding MongoDB service
   - Use your MongoDB Atlas connection string for `MONGO_URL`
   - Make sure your MongoDB Atlas IP whitelist allows Railway IPs (use 0.0.0.0/0)

### Step 3: Deploy Frontend

1. Click **"New Service"** → **"Deploy from GitHub repo"**
2. Select the same repository
3. Click **"Deploy Now"**

4. **Configure Frontend:**
   - Click on your frontend service
   - Go to **"Settings"** tab
   - Set **Root Directory**: `frontend`
   - Build Command: `npm install --legacy-peer-deps && npm run build`
   - Start Command: `npx serve build -s -p 3000`
   - Add environment variable:
     ```
     REACT_APP_BACKEND_URL = (Copy your backend Railway URL)
     ```

5. **Get Backend URL:**
   - Go to your backend service
   - Copy the URL (e.g., `https://your-backend.railway.app`)
   - Add it as `REACT_APP_BACKEND_URL` in frontend variables

### Step 4: Deploy Redis (Optional - for caching)

1. Click **"New Service"** → **"Database"** → **"Redis"**
2. Railway will create a free Redis instance
3. Add Redis connection string to backend variables if needed

## 🔧 Environment Variables

### Backend Variables
```
MONGO_URL=mongodb://mongo:password@mongo.railway.app:port/railway
DB_NAME=smartlearn
JWT_SECRET=your_secure_random_string_32_chars_min
PORT=8001
CORS_ORIGINS=https://your-frontend.railway.app
OPENROUTER_API_KEY=sk-or-v1-your_key
OPENROUTER_MODEL=openrouter/free
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key
```

### Frontend Variables
```
REACT_APP_BACKEND_URL=https://your-backend.railway.app
```

## 🎉 After Deployment

1. **Backend URL**: Click backend service → "Domains" tab → Copy URL
2. **Frontend URL**: Click frontend service → "Domains" tab → Copy URL
3. **Test Application**: Open frontend URL in browser
4. **Check Logs**: Click on each service → "Deployments" tab → View logs

## 📊 Monitoring

- Go to each service
- View metrics (CPU, Memory, Network)
- Check logs for errors
- Set up alerts if needed

## 💡 Tips

1. **Free Tier Limits:**
   - Railway: $5 free credit/month
   - MongoDB: 512MB free
   - After free credit, you pay for usage

2. **Auto-Deploy:**
   - Enable "Auto-deploy on push" in service settings
   - Changes will deploy automatically when you push to GitHub

3. **Custom Domain:**
   - Go to service → "Domains" tab
   - Add your custom domain
   - Update DNS records

4. **Environment Variables:**
   - Keep secrets in Railway variables
   - Never commit .env files to GitHub

## 🐛 Troubleshooting

### Backend Not Starting
- Check logs for errors
- Verify MongoDB connection string
- Ensure all environment variables are set
- Check if PORT is correct

### Frontend Build Errors
- Verify build command includes `--legacy-peer-deps`
- Check if node_modules is properly installed
- Review build logs for specific errors

### MongoDB Connection Issues
- Verify connection string format
- Check if MongoDB service is running
- Ensure correct database name

### CORS Errors
- Update CORS_ORIGINS with correct frontend URL
- Check if backend is accessible
- Verify both services are on the same domain

## 🚀 Quick Start

1. **Create Railway account** (use GitHub)
2. **Deploy backend** (with Railway MongoDB)
3. **Deploy frontend** (with backend URL)
4. **Test the application**
5. **Enable auto-deploy**

Your SmartLearn platform will be live on Railway with HTTPS, automatic SSL, and easy scaling!