# Quick Setup Guide

## Step 1: Install Dependencies

```bash
npm run install-all
```

## Step 2: Create .env File

Create a `.env` file in the root directory with the following content:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/goeasytrade
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
CLIENT_URL=http://localhost:3000
SESSION_SECRET=your-session-secret-change-this-in-production
```

## Step 3: Set Up MongoDB

Make sure MongoDB is running on your system:
- Local MongoDB: Start MongoDB service
- MongoDB Atlas: Use your connection string in `MONGODB_URI`

## Step 4: Set Up Google OAuth (Optional but Recommended)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Choose "Web application"
6. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
7. Copy Client ID and Client Secret to `.env`

## Step 5: Run the Application

```bash
npm run dev
```

This will start both the backend (port 5000) and frontend (port 3000).

## Step 6: Access the Application

Open your browser and navigate to: http://localhost:3000

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check your `MONGODB_URI` in `.env`
- For MongoDB Atlas, ensure your IP is whitelisted

### Google OAuth Not Working
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`
- Check that the redirect URI matches exactly
- Ensure Google+ API is enabled

### Port Already in Use
- Change `PORT` in `.env` for backend
- React default port is 3000, it will prompt to use another port if busy

