## MODIFIED Requirements

### Requirement: Auth Redirect
The authentication workflow MUST navigate the user programmatically upon success.
- Upon successful login or account creation, `AuthForm.tsx` MUST use `useNavigate()` from `react-router-dom` to redirect the user to `/dashboard`.
