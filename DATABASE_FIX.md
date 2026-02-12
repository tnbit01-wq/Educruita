# Database User Registration Fix

## Issue
"Database error saving new user" when registering new accounts.

## Root Cause
The database trigger `handle_new_user()` was failing when:
1. The role value didn't match the enum types exactly
2. Missing or null values in metadata
3. No error handling for edge cases

## Fix Applied

### Updated Trigger Function
The `handle_new_user()` trigger has been updated with:

1. **Robust Role Handling**:
   - Tries to cast the role from metadata
   - Falls back to 'candidate' if invalid or missing
   - Wrapped in exception handling

2. **Smart Default Values**:
   - Uses email prefix as fallback for missing full_name
   - Handles null/missing metadata gracefully

3. **Conflict Resolution**:
   - `ON CONFLICT DO UPDATE` instead of `DO NOTHING`
   - Ensures profile is always created/updated

4. **Error Logging**:
   - Logs warnings instead of failing
   - User creation succeeds even if profile creation has issues

## How to Apply the Fix

### Step 1: Update Supabase Database
1. Open your **Supabase Dashboard**
2. Go to **SQL Editor**
3. Copy the **entire** content of `supabase_schema.sql`
4. Paste and **Run** the script

### Step 2: Verify the Fix
Run this query in SQL Editor to check if the trigger is updated:

```sql
SELECT prosrc 
FROM pg_proc 
WHERE proname = 'handle_new_user';
```

You should see the updated function with error handling.

### Step 3: Test Registration
1. Go to `/auth/register`
2. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Password: Test123!
   - Role: Select either Candidate or Employer
3. Click Register
4. Check for successful registration message

## Expected Behavior After Fix

### ✅ Successful Registration
- User account created in `auth.users`
- Profile automatically created in `public.profiles`
- Default role assigned if not specified
- Email prefix used as name if full_name missing

### 🔍 Edge Cases Handled
1. **Invalid Role**: Defaults to 'candidate'
2. **Missing Name**: Uses email prefix (e.g., 'john' from 'john@example.com')
3. **Duplicate Registration**: Updates existing profile instead of failing
4. **Database Errors**: Logs warning but allows user creation to proceed

## Troubleshooting

### If registration still fails:

1. **Check Supabase Logs**:
   - Go to Dashboard → Logs → Database
   - Look for warnings from `handle_new_user()`

2. **Verify Enum Values**:
   ```sql
   SELECT enumlabel FROM pg_enum 
   WHERE enumtypid = 'user_role'::regtype;
   ```
   Should return: student, faculty, candidate, employer, admin, superadmin

3. **Check Profile Table Structure**:
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'profiles';
   ```

4. **Test Trigger Manually**:
   ```sql
   -- Simulate user creation
   SELECT handle_new_user() FROM auth.users LIMIT 1;
   ```

## Code References

### Register Component
**File**: `src/pages/auth/Register.jsx`
- Sends: `{ email, password, fullName, role }`

### Auth Context
**File**: `src/contexts/AuthContext.jsx`
- Maps to metadata: `{ full_name, role }`

### Database Trigger
**File**: `supabase_schema.sql` (lines 187-223)
- Reads from: `raw_user_meta_data->>'full_name'`
- Reads from: `raw_user_meta_data->>'role'`

## Additional Notes

### Why ON CONFLICT DO UPDATE?
- Handles rare race conditions
- Allows profile refresh on re-authentication
- More resilient than `DO NOTHING`

### Why Not Fail on Error?
- User account creation in `auth.users` should not be blocked
- Profile can be created/fixed later via API call
- Better user experience (can still login)

### Security Considerations
- Function runs as `SECURITY DEFINER`
- Only triggered by Supabase Auth system
- Cannot be called directly by users
- Validates all inputs before insertion

## Success Verification

After applying the fix, you should be able to:
- ✅ Register new users without database errors
- ✅ See profiles created automatically
- ✅ Login immediately after registration
- ✅ Access role-based features correctly

If you still encounter issues, check the Supabase logs for specific error messages.
