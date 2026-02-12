# Registration Debugging Guide

## Quick Fix Applied

### What Changed:

1. **Profile Creation Now Happens in Application Code** (Not Database Trigger)
   - More reliable
   - Better error messages
   - Easier to debug

2. **Enhanced Error Logging**
   - Browser console now shows detailed error information
   - Specific error codes and messages

3. **Trigger is Now Optional Backup**
   - Won't cause failures
   - Only runs if app-level creation somehow fails

---

## How to Test & Debug

### Step 1: Open Browser Console
1. Open your browser (Chrome/Edge)
2. Press `F12` to open DevTools
3. Go to the **Console** tab
4. Keep it open during registration

### Step 2: Try to Register
1. Go to `http://localhost:5173/auth/register`
2. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Password: Test123!
   - Role: Candidate or Employer
3. Click **Register**

### Step 3: Check Console Output

You should see logs like:
```
Starting registration with: { email: "test@example.com", fullName: "Test User", role: "candidate" }
```

**If successful:**
```
Registration successful
```

**If failed, you'll see:**
```
Registration failed - Full error: { ... }
Error details: {
  message: "...",
  code: "...",
  details: "...",
  hint: "...",
  statusCode: ...
}
```

---

## Common Error Codes & Solutions

### Error: "User already registered"
**Solution**: The email is already in Supabase. Try a different email or delete the user from Supabase Dashboard.

### Error: "23505" or "duplicate key"
**Cause**: Email already exists in database
**Solution**: 
1. Go to Supabase Dashboard → Authentication → Users
2. Delete the test user
3. Try again

### Error: "Failed to fetch"
**Cause**: Supabase connection issue
**Solution**:
1. Check `.env` file has correct values:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
2. Restart dev server: `npm run dev`

### Error: "Invalid role"
**Cause**: Role enum mismatch
**Solution**: Run this in Supabase SQL Editor:
```sql
-- Check valid roles
SELECT enumlabel FROM pg_enum WHERE enumtypid = 'user_role'::regtype;
```
Should return: student, faculty, candidate, employer, admin, superadmin

---

## Manual Testing in Supabase

### Test 1: Check if Auth Works
Run in Supabase SQL Editor:
```sql
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;
```

### Test 2: Check if Profiles are Created
```sql
SELECT id, email, full_name, role 
FROM public.profiles 
ORDER BY created_at DESC 
LIMIT 5;
```

### Test 3: Test Profile Creation Manually
```sql
-- Replace with actual user ID from auth.users
INSERT INTO public.profiles (id, email, full_name, role)
VALUES (
  'your-user-id-here',
  'test@example.com',
  'Test User',
  'candidate'::user_role
);
```

---

## If Still Failing

### Option A: Disable Email Confirmation (For Testing)
1. Go to Supabase Dashboard
2. Authentication → Settings
3. **Disable** "Email Confirmations"
4. Try registering again

### Option B: Check RLS Policies
Run in SQL Editor:
```sql
-- Check if profiles table allows inserts
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

You should see a policy like:
- `"Users can insert their own profile"`

### Option C: Temporarily Disable RLS (Testing Only!)
```sql
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
```

Try registration, then **RE-ENABLE**:
```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
```

---

## Success Checklist

After successful registration, verify:

✅ User appears in Supabase Dashboard → Authentication → Users
✅ Profile exists in public.profiles table
✅ You can login with the new account
✅ Role is set correctly (candidate/employer)

---

## What to Send If Issue Persists

Please copy and paste the following from browser console:

1. **Console Output** (all logs)
2. **Error Details** section
3. **Network Tab** → Find the failing request → Copy as cURL

Also helpful:
- Supabase project URL
- The exact error message shown to user

---

## Important Notes

### Changes Made to Code:
1. **`src/contexts/AuthContext.jsx`**: Now manually creates profile after signup
2. **`src/pages/auth/Register.jsx`**: Enhanced error logging
3. **`supabase_schema.sql`**: Simplified trigger (backup only)

### No Breaking Changes:
- Existing users not affected
- Login still works normally
- All other features unchanged

### Why This is Better:
- **Clearer Errors**: You'll see exactly what failed
- **More Reliable**: App-level control vs database trigger
- **Easier Debugging**: Console logs show each step
- **Graceful Degradation**: Even if one step fails, user account still created
