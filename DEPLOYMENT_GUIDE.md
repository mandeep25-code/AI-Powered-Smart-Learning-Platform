# SmartLearn Deployment Guide

This guide provides comprehensive instructions for deploying the SmartLearn AI-Powered Learning Platform to production.

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account (or self-hosted MongoDB)
- Razorpay account (for payments)
- OpenRouter API key (for AI features)
- Git account (for version control)
- Hosting platform account (choose one below)

## 🚀 Deployment Options

### Option 1: Vercel + Render (Recommended)

**Frontend (Vercel):**
1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to frontend folder: `cd frontend`
3. Login to Vercel: `vercel login`
4. Deploy: `vercel`
5. Set environment variables in Vercel dashboard:
   - `REACT_APP_BACKEND_URL`: Your backend URL

**Backend (Render):**
1. Create account at https://render.com
2. Create new "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Environment Variables:
     ```
     MONGO_URL=mongodb+srv://your_connection_string
     DB_NAME=smartlearn
     JWT_SECRET=your_jwt_secret
     PORT=8001
     CORS_ORIGINS=https://your-frontend-url.vercel.app
     OPENROUTER_API_KEY=your_openrouter_api_key
     OPENROUTER_MODEL=openrouter/free
     RAZORPAY_KEY_ID=your_razorpay_key_id
     RAZORPAY_KEY_SECRET=your_razorpay_key_secret
     ```

### Option 2: Netlify + Railway

**Frontend (Netlify):**
1. Install Netlify CLI: `npm i -g netlify-cli`
2. Build frontend: `cd frontend && npm run build`
3. Deploy: `netlify deploy --prod`
4. Add environment variables in Netlify dashboard

**Backend (Railway):**
1. Create account at https://railway.app
2. Create new Project
3. Add MongoDB service
4. Add Node.js service with your code
5. Configure environment variables

### Option 3: AWS (EC2 + S3 + RDS)

**Infrastructure Setup:**
1. Create AWS account
2. Set up RDS MongoDB instance
3. Create S3 bucket for frontend static files
4. Launch EC2 instance for backend
5. Configure security groups and networking

**Backend Deployment:**
```bash
# SSH into EC2
git clone your-repo
cd backend
npm install
pm2 start server.js
```

**Frontend Deployment:**
```bash
# Build frontend
cd frontend
npm run build

# Upload to S3
aws s3 sync build/ s3://your-bucket-name --delete

# Configure CloudFront CDN
```

### Option 4: DigitalOcean

**Backend (Droplet):**
1. Create Droplet (Ubuntu 20.04)
2. SSH into droplet
3. Install Node.js and MongoDB
4. Clone repository and deploy backend
5. Use PM2 for process management

**Frontend (App Platform):**
1. Create App in DigitalOcean
2. Connect GitHub repository
3. Configure build and start commands
4. Add environment variables

### Option 5: Docker Deployment

**Create Dockerfile for Backend:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 8001
CMD ["node", "server.js"]
```

**Create Dockerfile for Frontend:**
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Deploy with Docker Compose:**
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8001:8001"
    environment:
      - MONGO_URL=mongodb://mongo:27017/smartlearn
      - NODE_ENV=production
    depends_on:
      - mongo
  
  frontend:
    build: ./frontend
    ports:
      - "80:80"
  
  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

## 🔧 Environment Configuration

### Backend Environment Variables (.env)
```env
MONGO_URL=mongodb+srv://your_connection_string
DB_NAME=smartlearn
JWT_SECRET=your_secure_jwt_secret_32_chars_min
PORT=8001
CORS_ORIGINS=https://your-frontend-domain.com
OPENROUTER_API_KEY=sk-or-v1-your_openrouter_key
OPENROUTER_MODEL=openrouter/free
RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

### Frontend Environment Variables (.env)
```env
REACT_APP_BACKEND_URL=https://your-backend-domain.com
```

## 📦 Building for Production

### Frontend Build
```bash
cd frontend
npm install
npm run build
# Output in frontend/build/
```

### Backend Production Setup
```bash
cd backend
npm install --production
node server.js
```

## 🔒 Security Considerations

1. **MongoDB Security:**
   - Use IP whitelisting in MongoDB Atlas
   - Enable authentication
   - Use strong passwords

2. **Environment Variables:**
   - Never commit .env files
   - Use platform-specific secret management
   - Rotate keys regularly

3. **API Security:**
   - Enable HTTPS in production
   - Implement rate limiting
   - Use helmet.js for security headers
   - Validate all inputs

4. **Payment Security:**
   - Use Razorpay production keys
   - Implement webhook verification
   - Log all transactions
   - Regular security audits

## 🚀 Quick Deployment Steps

### Using Vercel + Render (Fastest)

1. **Frontend to Vercel:**
   ```bash
   cd frontend
   vercel
   ```

2. **Backend to Render:**
   - Push code to GitHub
   - Create Render account
   - Connect GitHub repo
   - Deploy as web service

3. **Configure:**
   - Update frontend env with backend URL
   - Add backend env variables
   - Test both services

### Using Docker (Self-hosted)

1. **Build and Run:**
   ```bash
   docker-compose up -d
   ```

2. **Access:**
   - Frontend: http://localhost
   - Backend: http://localhost:8001

## 📊 Performance Optimization

### Frontend
- Bundle size: 665KB (gzip: 18KB)
- Consider code splitting for better performance
- Enable CDN for static assets
- Implement lazy loading

### Backend
- Use PM2 for process management
- Enable gzip compression
- Implement caching strategies
- Use connection pooling for MongoDB

## 🧪 Pre-Deployment Checklist

- [ ] Update all environment variables
- [ ] Test Razorpay payment flow
- [ ] Verify MongoDB connection
- [ ] Test OpenRouter AI integration
- [ ] Enable HTTPS
- [ ] Set up domain names
- [ ] Configure DNS records
- [ ] Set up monitoring/logging
- [ ] Test complete user flow
- [ ] Set up backup strategy

## 🔄 CI/CD Pipeline (Optional)

### GitHub Actions Example
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./frontend

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        uses: johnbeynon/render-deploy-action@v0.0.1
        with:
          service-id: ${{ secrets.RENDER_SERVICE_ID }}
          render-api-key: ${{ secrets.RENDER_API_KEY }}
```

## 📱 Post-Deployment

1. **Test the Application:**
   - User registration/login
   - Dashboard loading
   - Course enrollment
   - AI Tutor functionality
   - Payment flow
   - All pages and features

2. **Monitor Performance:**
   - Set up error tracking (Sentry)
   - Monitor API response times
   - Track user analytics
   - Set up uptime monitoring

3. **Backup Strategy:**
   - Regular MongoDB backups
   - Code repository backups
   - Environment variable backups
   - Asset backups

## 🆘 Troubleshooting

### Common Issues

**CORS Errors:**
- Ensure CORS_ORIGINS includes your frontend domain
- Check that backend allows requests from frontend

**MongoDB Connection:**
- Verify MongoDB URL is correct
- Check IP whitelisting in MongoDB Atlas
- Ensure database is accessible

**Payment Failures:**
- Verify Razorpay keys are correct
- Check webhook URL configuration
- Ensure payment verification logic is working

**Build Failures:**
- Check Node.js version compatibility
- Verify all dependencies are installed
- Check for TypeScript/ESLint errors

## 📞 Support

For deployment issues:
- Check platform-specific documentation
- Review error logs
- Test in development environment first
- Contact platform support if needed

## 🎯 Recommended Deployment Stack

**For Beginners:** Vercel + Render
**For Performance:** AWS with CloudFront
**For Cost-Effective:** DigitalOcean
**For Control:** Self-hosted Docker
**For Scale:** Kubernetes with major cloud provider

Choose the option that best fits your requirements and expertise level!