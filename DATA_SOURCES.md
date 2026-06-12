# Data Sources Guide

## Which Database is Used For What?

### Firebase
- **Auth**: User login/signup (email/password)
- **Firestore**: Primary database for ALL user data and walls
  - `users/{uid}`: User profiles
  - `usernames/{username}`: Username → UID index
  - Soon: `users/{uid}/blocks/{blockId}`: Wall blocks

### Supabase
- **Auth**: Admin login only
- **Database**: Secondary/mirror database
  - `users`: Mirror of Firebase user profiles (for admin)
  - `reserved_usernames`: Admin-managed reserved usernames
  - `site_config`: Global site settings
  - `analytics_events`: Analytics

## How to Make Signup Work

1. **Enable Email/Password auth in Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Select your project → Authentication → Sign-in method
   - Enable "Email/Password" provider

2. **Create Firestore Database**
   - In Firebase Console → Firestore Database
   - Start in **Test Mode** for now (we can add security rules later)
   - Make sure the database is initialized

3. **Create Supabase Tables (if you want admin features)**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Go to SQL Editor and run the queries from `SETUP.md`

## Now Test It!

Open your browser, go to the signup page, and check the **Developer Tools Console** (F12) to see all the logs!
