## Why

The application currently suffers from the "Invalid path specified in request URL" exception because the Supabase client initialization blindly passes potentially undefined environment variables to `createClient`. Additionally, if a trailing slash is accidentally included in `VITE_SUPABASE_URL`, it can cause path resolution errors. 

Furthermore, the `AuthForm.tsx` component needs better error handling to properly catch and report database constraints (such as a Nickname already existing but the user entered the wrong PIN, or trying to create an account with an existing nickname).

## What Changes

- Add strict validation to `src/lib/supabaseclient.ts` to ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are present before initializing the client. Throw clear, actionable errors if they are missing.
- Strip trailing slashes from the Supabase URL before passing it to `createClient`.
- Update `AuthForm.tsx` to handle authentication edge cases more gracefully, displaying specific error messages when database constraints are violated.

## Capabilities

### Modified Capabilities
- `supabase-client`: Made defensive and fail-fast when environment variables are missing.
- `auth`: Improved error handling in the UI to give users actionable feedback when they hit unique constraints or invalid credentials.

## Impact

- **Developer Experience**: Clear error messages when environment variables are missing instead of cryptic URL parsing errors inside the `supabase-js` library.
- **User Experience**: Users will see clear error messages in the Auth form when they enter wrong PINs or try to create accounts with existing nicknames, rather than generic or unhandled errors.
