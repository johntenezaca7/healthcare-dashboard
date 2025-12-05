# Deployment Guide

This guide covers deploying the Healthcare Dashboard to Render.

## Prerequisites

- GitHub repository with your code
- Render account (free tier available)

## Backend Deployment

### 1. Create PostgreSQL Database

1. Go to Render Dashboard → New → PostgreSQL
2. Name: `healthcare-db`
3. Database: `healthcare_db`
4. User: `healthcare_user`
5. Plan: Free
6. Click "Create Database"
7. **Save the Internal Database URL** (you'll need this)

### 2. Deploy Backend API

1. Go to Render Dashboard → New → Web Service
2. Connect your GitHub repository
3. Configure:
   - **Name**: `healthcare-api`
   - **Environment**: Docker
   - **Dockerfile Path**: `./backend/Dockerfile`
   - **Docker Context**: `./backend`
   - **Plan**: Free
4. Environment Variables:
   - `DATABASE_URL`: Use the Internal Database URL from step 1
   - `SECRET_KEY`: Generate a secure random string (or use Render's generator)
   - `CORS_ORIGINS`: Your frontend URL (e.g., `https://healthcare-web.onrender.com`)
5. Health Check Path: `/health`
6. Click "Create Web Service"

### 3. Generate Sample Data

Once the backend is deployed:

1. Go to your backend service → Shell
2. Run: `python -m app.generate_data`

Or use Render's shell:
```bash
# SSH into the service
render ssh healthcare-api

# Run data generation
python -m app.generate_data
```

## Frontend Deployment

### Option 1: Static Site (Recommended for Render)

1. Go to Render Dashboard → New → Static Site
2. Connect your GitHub repository
3. Configure:
   - **Name**: `healthcare-web`
   - **Build Command**: `cd frontend && pnpm install && pnpm run build`
   - **Publish Directory**: `frontend/dist`
   - **Environment**: Node 18
4. Environment Variables:
   - `VITE_API_BASE_URL`: Your backend URL (e.g., `https://healthcare-api.onrender.com`)
5. Click "Create Static Site"

**Note**: Vite environment variables must start with `VITE_` and are baked into the build at build time.

### Option 2: Docker (Using Dockerfile.prod)

1. Go to Render Dashboard → New → Web Service
2. Connect your GitHub repository
3. Configure:
   - **Name**: `healthcare-web`
   - **Environment**: Docker
   - **Dockerfile Path**: `./frontend/Dockerfile.prod`
   - **Docker Context**: `./frontend`
   - **Plan**: Free
4. Environment Variables:
   - `VITE_API_BASE_URL`: Your backend URL (e.g., `https://healthcare-api.onrender.com`)
5. Build Command (optional, for build args):
   ```bash
   docker build --build-arg VITE_API_BASE_URL=$VITE_API_BASE_URL -f Dockerfile.prod -t healthcare-web .
   ```
6. Click "Create Web Service"

## Environment Variables Summary

### Backend (`healthcare-api`)
- `DATABASE_URL`: PostgreSQL connection string (from Render database)
- `SECRET_KEY`: JWT secret key (generate a secure random string)
- `CORS_ORIGINS`: Frontend URL (e.g., `https://healthcare-web.onrender.com`)

### Frontend (`healthcare-web`)
- `VITE_API_BASE_URL`: Backend API URL (e.g., `https://healthcare-api.onrender.com`)

## Post-Deployment

1. **Update CORS**: Make sure `CORS_ORIGINS` in backend includes your frontend URL
2. **Generate Data**: Run the data generation script on the backend
3. **Test**: Visit your frontend URL and verify everything works

## Troubleshooting

### Backend Issues

- **Database Connection**: Verify `DATABASE_URL` uses the Internal Database URL (not public)
- **Health Check**: Check `/health` endpoint is accessible
- **Logs**: Check Render logs for errors

### Frontend Issues

- **API Calls Failing**: Verify `VITE_API_BASE_URL` is set correctly
- **CORS Errors**: Check backend `CORS_ORIGINS` includes frontend URL
- **Build Failures**: Check build logs for missing dependencies

### Common Issues

- **Environment Variables**: Remember Vite vars must start with `VITE_` and are baked at build time
- **Database**: Use Internal Database URL, not the public connection string
- **CORS**: Both frontend and backend URLs must match exactly (including https/http)

## Using render.yaml (Alternative)

You can use the provided `render.yaml` file for automated deployment:

1. Push `render.yaml` to your repository root
2. Go to Render Dashboard → New → Blueprint
3. Connect your repository
4. Render will automatically detect and configure services

**Note**: You'll still need to manually set environment variables in the Render dashboard.

