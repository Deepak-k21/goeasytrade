# Trades

A professional business registration platform built with React.js, Node.js, and MongoDB.

## Features

- **Loading Page**: Beautiful animated loading screen with GoEasyTrade branding
- **Authentication**: Login and Sign Up pages with Google OAuth integration
- **Business Information Collection**: Multi-step form to collect:
  - Certificate of Incorporation (PDF)
  - GST No
  - Company PAN Card (PDF)
  - MSME Registration/Declaration (PDF)
  - Contact Information (Primary & Secondary)
  - Business and Contact Addresses
- **Confirmation Page**: Display all submitted information and uploaded files
- **Professional UI**: Paytm-inspired blue gradient theme

## Tech Stack

- **Frontend**: React.js, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT, Passport.js (Google OAuth)
- **File Upload**: Multer

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Google OAuth credentials (for Google login)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd trades
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd client
npm install
cd ..
```

Or use the convenience script:
```bash
npm run install-all
```

4. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the following variables:
     ```
     PORT=5000
    MONGODB_URI=mongodb://localhost:27017/goeasytrade
     JWT_SECRET=your-super-secret-jwt-key
     GOOGLE_CLIENT_ID=your-google-client-id
     GOOGLE_CLIENT_SECRET=your-google-client-secret
     CLIENT_URL=http://localhost:3000
     SESSION_SECRET=your-session-secret
     ```

5. Set up Google OAuth:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
   - Copy Client ID and Client Secret to `.env`

## Running the Application

### Development Mode

Run both frontend and backend concurrently:
```bash
npm run dev
```

Or run them separately:

**Backend:**
```bash
npm run server
```

**Frontend:**
```bash
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Project Structure

```
trades/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable components
│       ├── context/        # React context (Auth)
│       ├── pages/          # Page components
│       └── App.js
├── server/                 # Node.js backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── uploads/           # Uploaded files (created automatically)
│   └── index.js
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback

### User
- `GET /api/user/me` - Get current user (protected)

### Business
- `POST /api/business/submit` - Submit business information (protected)
- `GET /api/business/info` - Get business information (protected)

## Usage Flow

1. **Loading Page**: Shows GoEasyTrade branding
2. **Login/Sign Up**: User authenticates via email/password or Google
3. **Business Form**: Multi-step form to collect business information
   - Step 1: Upload documents (Certificate, PAN, MSME)
   - Step 2: Contact information
   - Step 3: Addresses
4. **Confirmation**: Display all submitted information

## File Upload

- Maximum file size: 10MB
- Accepted format: PDF only
- Files are stored in `server/uploads/` directory

## Security Notes

- Change `JWT_SECRET` and `SESSION_SECRET` in production
- Use environment variables for sensitive data
- Implement proper CORS settings for production
- Use HTTPS in production
- Validate and sanitize all user inputs

## License

ISC

