# Leap Scholar - Firebase Setup Guide

Leap Scholar now uses Firebase for authentication and data storage. Follow these steps to get started.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Google account for Firebase

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter your project name (e.g., "leap-scholar")
4. Follow the setup wizard
5. Enable Google Analytics (optional)
6. Create the project

## Step 2: Set Up Firebase Authentication

1. In your Firebase project, go to **Authentication** (left sidebar)
2. Click **Get Started**
3. Enable **Email/Password** authentication:
   - Click the **Email/Password** option
   - Toggle "Enable" to ON
   - Click **Save**

## Step 3: Get Your Firebase Config

1. Go to **Project Settings** (gear icon at top)
2. Scroll to "Your apps" section
3. Click the **</> ** (Web) icon if not already created
4. Copy the Firebase config object with these credentials:
   - API Key
   - Auth Domain
   - Project ID
   - Storage Bucket
   - Messaging Sender ID
   - App ID

## Step 4: Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in your Firebase credentials in `.env.local`:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

## Step 5: Set Up Firestore Database (Optional)

For future data persistence beyond auth:

1. Go to **Firestore Database** in Firebase Console
2. Click **Create Database**
3. Choose **Start in production mode**
4. Select your region
5. Click **Create**

## Step 6: Run the Application

```bash
cd app
npm install
npm run dev
```

The app will start at `http://localhost:5178/`

## Creating Test Accounts

1. Click "Create an account" on the login page
2. Enter your email and password
3. Confirm password
4. Click "Sign up"

Your account will be created in Firebase Authentication.

## Features

### Authentication
- ✅ Email/Password registration
- ✅ Login with persistence
- ✅ Logout
- ✅ Session management

### Data
- ✅ User profiles stored in Firestore
- ✅ Tasks and achievements
- ✅ Study groups and leaderboard
- ✅ Notifications

## Troubleshooting

### "Firebase configuration missing"
Make sure `.env.local` is created with all Firebase credentials.

### "Permission denied" errors
Check that Firebase Firestore rules allow read/write for authenticated users:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Email already exists
Firebase automatically prevents duplicate emails. Use a different email.

## Local Development with Emulator (Optional)

To use Firebase Emulator Suite locally:

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Start the emulator:
   ```bash
   firebase emulators:start
   ```

3. In `.env.local`, set:
   ```
   VITE_USE_FIREBASE_EMULATOR=true
   ```

## File Structure

```
src/
├── lib/
│   ├── firebase.ts       # Firebase configuration
│   └── database.ts       # Database utilities
├── contexts/
│   ├── AuthContext.tsx   # Firebase Auth context
│   └── DataContext.tsx   # Firestore data context
└── components/
    └── AuthPage.tsx      # Login/Signup page
```

## Next Steps

1. Set up Firestore database for persistent data storage
2. Implement real-time database synchronization
3. Add user profile pictures with Firebase Storage
4. Set up Firestore security rules
5. Implement email verification
6. Add password reset functionality

## Support

For issues with Firebase setup, visit:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Console Help](https://console.firebase.google.com/)
