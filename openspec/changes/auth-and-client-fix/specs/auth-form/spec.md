## MODIFIED Requirements

### Requirement: Auth Form Error Handling
The `AuthForm.tsx` component MUST correctly handle and display errors related to database constraints.
- When creating an account, if the nickname already exists, it MUST display a specific error.
- When logging in, it MUST verify the PIN correctly. If the user doesn't exist or the PIN is incorrect, it MUST display an appropriate error instead of failing silently or logging in anyway.
