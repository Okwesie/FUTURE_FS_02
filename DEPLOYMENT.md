# 🚀 Deployment Guide - E-commerce Storefront

## Overview
This guide will help you deploy your e-commerce application to production using Vercel for the frontend and Railway/Render for the backend.

## 📋 Prerequisites
- [Vercel account](https://vercel.com) (free)
- [Railway account](https://railway.app) or [Render account](https://render.com) (free)
- [GitHub account](https://github.com) (free)

## 🎯 Deployment Strategy

### Frontend (Next.js) → Vercel
### Backend (Node.js/Express) → Railway or Render
### Database → Neon PostgreSQL (already set up)

## 🚀 Step 1: Deploy Backend

### Option A: Railway (Recommended)
1. Go to [Railway.app](https://railway.app) and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Connect your GitHub account and select your repository
4. Railway will auto-detect it's a Node.js project
5. Set the root directory to `backend`
6. Add environment variables:
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_wrMIl9KZg4nv@ep-old-wind-adco15t8-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   CORS_ORIGIN=https://your-vercel-app.vercel.app
   NODE_ENV=production
   PORT=4000
   ```
7. Deploy! Railway will give you a URL like `https://your-app.railway.app`

### Option B: Render
1. Go to [Render.com](https://render.com) and sign up
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Environment**: Node
5. Add environment variables (same as Railway)
6. Deploy!

## 🎨 Step 2: Deploy Frontend to Vercel

1. Go to [Vercel.com](https://vercel.com) and sign up
2. Click "New Project" → "Import Git Repository"
3. Select your repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (leave as is)
5. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
   ```
6. Deploy!

## 🔧 Step 3: Update CORS Settings

After getting your Vercel URL, update your backend CORS_ORIGIN:
```
CORS_ORIGIN=https://your-app-name.vercel.app
```

## 🧪 Step 4: Test Production

1. Visit your Vercel URL
2. Test user registration/login
3. Test product browsing
4. Test cart functionality
5. Test checkout process

## 📁 Project Structure for Deployment

```
ecommerce-storefront/
├── backend/                 # Backend API (deploy to Railway/Render)
│   ├── src/
│   ├── package.json
│   └── ...
├── app/                     # Next.js app (deploy to Vercel)
├── components/
├── contexts/
├── package.json
└── ...
```

## 🔐 Environment Variables Summary

### Backend (Railway/Render)
- `DATABASE_URL` - Your Neon PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CORS_ORIGIN` - Your Vercel frontend URL
- `NODE_ENV=production`

### Frontend (Vercel)
- `NEXT_PUBLIC_API_URL` - Your backend URL

## 🎉 You're Done!

Your e-commerce application will be live at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.railway.app`
- **Database**: Neon PostgreSQL (cloud)

## 🆘 Troubleshooting

### Common Issues:
1. **CORS errors**: Make sure CORS_ORIGIN matches your Vercel URL exactly
2. **Database connection**: Verify DATABASE_URL is correct
3. **Build failures**: Check that all dependencies are in package.json

### Support:
- Vercel: [Vercel Docs](https://vercel.com/docs)
- Railway: [Railway Docs](https://docs.railway.app)
- Render: [Render Docs](https://render.com/docs)
