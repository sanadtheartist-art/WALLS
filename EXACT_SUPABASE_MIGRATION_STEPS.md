
# EXACT SUPABASE MIGRATION STEP-BY-STEP PLAN
This file lists EVERY file I will modify and EXACTLY what I will change, with no code edits yet!

---

## PRE-REQUISITES (ALREADY COMPLETED)
- ✅ Supabase SQL migration ran successfully (04_full_supabase_migration.sql)
- ✅ Google OAuth provider enabled in Supabase
- ✅ Supabase config already exists in src/config/supabase.js

---

## PART 1: REMOVE FIREBASE DEPENDENCY
### Step 1.1: Uninstall Firebase Packages
Run these commands in terminal:
- `npm uninstall firebase`
- (Keep @supabase/supabase-js, it's already installed!)

### Step 1.2: Delete src/config/firebase.js
- File to delete: src/config/firebase.js
- Reason: We no longer use Firebase!

---

## PART 2: REWRITE src/stores/auth.js (COMPLETE OVERHAUL)
### Original Firebase Auth Functions:
1. signUp() → uses Firebase createUserWithEmailAndPassword
2. login() → uses Firebase signInWithEmailAndPassword
3. loginWithGoogle() → uses Firebase signInWithPopup
4. updateUsername(), updateProfile(), updateDesign(), etc. → use Firestore

### New Supabase Auth Functions to Implement:
1. signUp(email, password, username, displayName):
   a. Use `supabase.auth.signUp()` to create user
   b. Insert profile into `public.profiles` table
   c. Insert username into `public.usernames` table
2. login(email, password): Use `supabase.auth.signInWithPassword()`
3. loginWithGoogle(): Use `supabase.auth.signInWithOAuth({ provider: 'google' })`
4. logout(): Use `supabase.auth.signOut()`
5. Add real-time listener for auth state changes
6. Rewrite updateUsername(), updateProfile(), updateDesign(), updateSettings() to use Supabase `UPDATE` on `profiles` table
7. Rewrite blocks logic to use Supabase `blocks` table (insert, update, delete, reorder)
8. Rewrite analytics tracking to insert into `analytics_events` table

---

## PART 3: UPDATE ALL COMPONENTS/PAGES
### Files to Update & What Changes:
1. **src/pages/SignupPage.vue**:
   - Remove Firebase auth calls, switch to new auth store functions
   - Google login calls new loginWithGoogle()
   - Password setup flow remains the same, just uses new auth store
   - Avatar upload still uses Cloudinary (keep same code!)

2. **src/pages/LoginPage.vue**:
   - Switch to new login() and loginWithGoogle() functions from auth store

3. **src/pages/PublicProfile.vue**:
   - Remove Firestore listeners for user/blocks
   - Add Supabase SELECT queries for public profile & blocks
   - Use Supabase real-time subscriptions if needed

4. **src/pages/dashboard/Dashboard*.vue (All dashboard pages)**:
   - Switch all profile/design/settings updates to use new auth store functions
   - Blocks editor uses new blocks logic from auth store

5. **src/pages/admin/Admin*.vue (All admin pages)**:
   - Keep using same Supabase queries! (They already use Supabase!)
   - No changes needed except updating AdminLoginPage to use Supabase admin auth

6. **src/components/layout/TopBar.vue**:
   - Switch logout button to use new logout() function
   - Remove Firebase admin auth references

---

## PART 4: BOOTSTRAP MOBILE HYBRID INTEGRATION
### Step 4.1: Install Bootstrap
Run command: `npm install bootstrap`

### Step 4.2: Add Conditional CSS to index.html
Add in head of index.html (only loads Bootstrap on small screens):
```html
<!-- BOOTSTRAP FOR MOBILE ONLY -->
<link 
  media="only screen and (max-width: 768px)" 
  rel="stylesheet" 
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
>
```

### Step 4.3: Update Mobile Layouts
- Use Bootstrap grid for mobile layout in DashboardLayout.vue
- Keep existing custom CSS for desktop
- No changes to desktop design at all!

---

## PART 5: TESTING PLAN
1. Test sign up (email & Google)
2. Test login (email & Google)
3. Test wall creation (add blocks, edit, delete, reorder)
4. Test profile/design settings
5. Test public profile view
6. Test admin panel
7. Test mobile layout (using Bootstrap grid)

---

## PART 6: FINAL DEPLOYMENT STEPS
- Run `npm run build` to test production build
- Push changes to Git
- Deploy to Vercel/hosting provider
- Update env vars if needed (should be same!)

