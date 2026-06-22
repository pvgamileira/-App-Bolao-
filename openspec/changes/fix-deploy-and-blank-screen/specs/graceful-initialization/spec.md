## ADDED Requirements

### Requirement: Graceful fallback for missing configuration
The application SHALL NOT crash silently with a blank screen when Supabase configuration variables are missing.

#### Scenario: Missing environment variables on load
- **WHEN** `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` are undefined
- **THEN** the application should render a user-friendly configuration error screen instead of a blank page
