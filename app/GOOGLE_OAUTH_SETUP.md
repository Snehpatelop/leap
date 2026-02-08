# Google OAuth Setup Guide for Firebase

## Step 1: Enable Google Authentication in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **leap-74c1b**
3. Click **Authentication** (left sidebar)
4. Go to **Sign-in method** tab
5. Click **Google**
6. Toggle **Enable** to ON
7. Select a **Project support email** (required)
8. Click **Save**

## Step 2: Configure OAuth Consent Screen (Google Cloud Console)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Make sure you're in the same project as Firebase (leap-74c1b)
3. Go to **APIs & Services** → **OAuth consent screen**
4. Select **External** as User Type
5. Click **Create**
6. Fill in:
   - **App name**: Leap Scholar
   - **User support email**: Your email
   - **Developer contact information**: Your email
7. Click **Save and Continue**
8. On **Scopes** page, click **Save and Continue**
9. On **Test users** page, add your Google account email
10. Click **Save and Continue**

## Step 3: Create OAuth 2.0 Credentials

1. Still in Google Cloud Console
2. Go to **APIs & Services** → **Credentials**
3. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
4. Select **Web application**
5. Add Authorized redirect URIs:
   ```
   http://localhost:3000
   http://localhost:5178
   http://localhost:5179
   http://localhost:5180
   http://yourdomainname.com
   http://www.yourdomainname.com
   ```
6. Click **Create**
7. Copy the **Client ID**
8. You can close the dialog (doesn't need Client Secret for web apps using popup auth)

## Step 4: Add Authorized Domains to Firebase Console

1. Back in Firebase Console
2. Go to **Authentication** → **Settings**
3. Scroll to **Authorized domains**
4. Add:
   - `localhost`
   - `yourdomainname.com`
   - `www.yourdomainname.com`
5. Click **Save**

## Step 5: Set Up Firestore Security Rules

1. In Firebase Console
2. Go to **Firestore Database**
3. Click **Rules** tab
4. Replace the rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Allow authenticated users to read/write their own user profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read/write their own user profile data (nested collection)
    match /userProfiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Default deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

5. Click **Publish**

## Step 6: Verify App is Running on Correct Port

The app should now be running on one of these ports:
- http://localhost:5178/
- http://localhost:5179/
- http://localhost:5180/

Check the terminal output to see which port.

## Step 7: Test Google Sign-In

1. Go to your app URL
2. Click "Create Account" or stay on login
3. Click the **Google** button
4. Select your test account (the one you added in OAuth Consent Screen setup)
5. You should be redirected to dashboard

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Make sure your localhost port is added to Authorized domains and OAuth redirect URIs
- Check Firebase Console → Authentication → Settings → Authorized domains

### Error: "popup_closed_by_user"  
- This is normal - user just cancelled the Google sign-in popup

### Error: "access_denied"
- Make sure your email is added as a test user in OAuth Consent Screen
- Wait a few minutes for changes to propagate

### Firestore: "Permission denied" errors
- Check that security rules are properly published
- Make sure rules allow authenticated users: `request.auth != null`

### No User Profile Created
- Check browser console for errors (F12)
- Check Firebase Console → Firestore → Data to see if documents are being created
- Check that Firestore rules are correct

## Production Deployment Notes

For production, you'll need to:

1. Move Google OAuth app from "External" to "In production" (OAuth Consent)
2. Add your production domain to Authorized domains
3. Update environment variables with your domain
4. Use Cloud Security settings to restrict API access
5. Enable reCAPTCHA for additional security

## Helpful Links

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Firebase Firestore Security Rules](https://firebase.google.com/docs/rules)
- [Google Cloud OAuth Setup](https://cloud.google.com/docs/authentication/oauth-2-0)
- [Firebase Console](https://console.firebase.google.com/)
- [Google Cloud Console](https://console.cloud.google.com/)
