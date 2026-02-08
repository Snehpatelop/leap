# Google Sign-In Troubleshooting Checklist

## ✅ Verification Steps

Before testing, verify these are all set up correctly:

### 1. Firebase Project Configuration
- [ ] Go to [Firebase Console](https://console.firebase.google.com/)
- [ ] Select project: `leap-74c1b`
- [ ] Verify **Authentication** is enabled
- [ ] Verify **Google** provider is enabled
  - Go to Authentication → Sign-in method → Google
  - Should show "Enabled" with green checkmark
- [ ] Add **Project support email** (required for Google OAuth)
- [ ] Go to **Settings** and verify **Authorized domains** includes:
  - [ ] `localhost`
  - [ ] `127.0.0.1`

### 2. Google Cloud OAuth Configuration
- [ ] Go to [Google Cloud Console](https://console.cloud.google.com/)
- [ ] Select the same project: `leap-74c1b`
- [ ] Go to **APIs & Services** → **OAuth consent screen**
- [ ] Verify **User Type** is `External`
- [ ] Add your **Gmail address** as a **Test user**
- [ ] Go to **APIs & Services** → **Credentials**
- [ ] Verify **Web client** OAuth 2.0 ID exists
- [ ] Under **Authorized redirect URIs**, verify these are added:
  - [ ] `http://localhost:3000`
  - [ ] `http://localhost:5178`
  - [ ] `http://localhost:5179`
  - [ ] `http://localhost:5180`
  - [ ] `http://localhost:5181`

### 3. Firestore Database
- [ ] Go to **Firestore Database** in Firebase Console
- [ ] Verify database is created
- [ ] Go to **Rules** tab
- [ ] Replace rules with security rules from `FIRESTORE_RULES.txt`
- [ ] Click **Publish**

### 4. Environment Variables
- [ ] Check `.env.local` exists in `app/` folder
- [ ] Verify all Firebase credentials are filled:
  ```
  VITE_FIREBASE_API_KEY=AIzaSyDev1yTD5XnUIU0wGoo0ZQCiQFX5J99_TQ
  VITE_FIREBASE_AUTH_DOMAIN=leap-74c1b.firebaseapp.com
  VITE_FIREBASE_PROJECT_ID=leap-74c1b
  VITE_FIREBASE_STORAGE_BUCKET=leap-74c1b.firebasestorage.app
  VITE_FIREBASE_MESSAGING_SENDER_ID=817787023524
  VITE_FIREBASE_APP_ID=1:817787023524:web:082833a10211875abdf631
  ```

### 5. App is Running
- [ ] Terminal shows: `VITE v7.3.0 ready`
- [ ] App is accessible at one of these URLs:
  - [ ] `http://localhost:5178`
  - [ ] `http://localhost:5179`
  - [ ] `http://localhost:5180`
- [ ] Copy the exact URL from terminal

## 🧪 Testing Steps

1. **Open Browser DevTools**
   - Press `F12`
   - Go to **Console** tab
   - Keep it open while testing

2. **Click Google Button**
   - Should see console message: "Starting Google sign-in..."
   - Google popup should appear
   - If popup doesn't appear, check browser's popup blocker

3. **Select Account**
   - Select your email (that you added as test user)
   - If you don't see your email, you weren't added as test user

4. **Check Console Output**
   - Should see: "Google sign-in successful, user: yourname@gmail.com"
   - Should see: "Creating new user profile..." (first time) OR "updating last login..." (returning)
   - Should see: "User profile created successfully"

5. **Check Firestore**
   - Go to Firebase Console → Firestore Database → Data
   - Look for collection `users` with new document
   - Document ID should match user's Firebase UID

## 🔴 Common Errors & Solutions

### Error: "redirect_uri_mismatch"
**Problem:** Port not authorized
**Solution:**
1. Check the exact port in terminal (5178, 5179, 5180, etc.)
2. Go to Google Cloud Console → Credentials
3. Edit the Web client
4. Add authorized redirect URIs with the exact port:
   - `http://localhost:XXXX`
   - `http://127.0.0.1:XXXX`
5. Save and wait 5 minutes

### Error: "access_denied" or No popup appears
**Problem:** User not added to test users
**Solution:**
1. Go to Google Cloud Console → OAuth consent screen
2. Go to **Test users** tab
3. Add your Gmail address
4. Click **Save**
5. Wait 5 minutes

### Error: "unauthorized_client" or popup blocked
**Problem:** OAuth consent screen not configured
**Solution:**
1. Go to Google Cloud Console → OAuth consent screen
2. Complete ALL required fields:
   - App name
   - User support email
   - Developer contact info
3. Save and go through all steps
4. Make sure status says "In testing"

### Error: "auth/popup-closed-by-user" after config
**Problem:** User clicked Cancel
**Solution:** Try again, this is normal

### Error: "Permission denied" in Firestore
**Problem:** Security rules not set
**Solution:**
1. Go to Firebase Console → Firestore Database → Rules
2. Copy rules from `FIRESTORE_RULES.txt`
3. Paste and click **Publish**

### No document created in Firestore
**Problem:** Firestore rules blocking writes or wrong collection name
**Solution:**
1. Check browser console for errors
2. Go to Firebase Console → Firestore Database → Data
3. Manually create collection `users` if needed
4. Check rules allow: `request.auth != null && request.auth.uid == userId`

## 📋 Console Commands to Debug

Open browser console (F12) and run:

```javascript
// Check if auth is initialized
firebase.auth()

// Check current user
firebase.auth().currentUser

// Check Firestore is ready
firebase.firestore()

// View user credentials
firebase.auth().currentUser.getIdToken().then(token => console.log(token))
```

## 🆘 Still Not Working?

1. **Check all console messages** - screenshot them
2. **Check Network tab** (F12 → Network) 
   - Look for failed requests to `googleapis.com`
3. **Check Application tab** (F12 → Application)
   - Look for localStorage with Firebase session data
4. **Clear browser cache**
   - `Ctrl+Shift+Delete` or manually clear site data
5. **Try incognito window**
   - Sometimes cookies/cache cause issues

## 📞 Support Resources

- [Firebase Auth Troubleshooting](https://firebase.google.com/support/troubleshooter/auth)
- [Google OAuth Error Codes](https://developers.google.com/identity/sign-in/web/reference)
- [Firebase Console](https://console.firebase.google.com/)
- [Google Cloud Console](https://console.cloud.google.com/)
