# Remove Firebase and Add Demo Mode - TODO

## Tasks:
- [x] Update AuthContext.tsx - Replace Firebase Auth with localStorage mock
- [x] Update DataContext.tsx - Replace Firestore with localStorage
- [x] Update AuthPage.tsx - Add demo try button
- [x] Update firebase.ts - Remove Firebase dependencies
- [x] Test the implementation

## Progress:
All tasks completed! Firebase has been successfully removed and replaced with localStorage-based mock authentication and data persistence. A "Try Demo" button has been added to the AuthPage for users to try the app without registration.

## Summary of Changes:

1. **AuthContext.tsx**: 
   - Removed all Firebase Auth imports
   - Implemented localStorage-based user storage
   - Added `tryDemo()` function for demo mode
   - Users are now stored in localStorage with their passwords
   - Session persistence via localStorage

2. **DataContext.tsx**:
   - Removed all Firestore imports
   - Replaced Firestore operations with localStorage
   - Data is now stored per-user in localStorage
   - All CRUD operations work with localStorage

3. **AuthPage.tsx**:
   - Added "Try Demo" button with Play icon
   - Button appears below Google sign-in
   - Styled with indigo theme to stand out

4. **firebase.ts**:
   - Removed all Firebase initialization code
   - Kept as placeholder file with null exports
   - Added comments explaining the change

## Features Preserved:
- Email/password authentication
- Google sign-in (mock)
- User data persistence
- Task management
- Study groups
- Notifications
- All dashboard features

## New Features:
- Demo mode - try without registration
- All data stored locally in browser
