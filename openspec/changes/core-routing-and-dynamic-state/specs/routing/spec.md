## ADDED Requirements

### Requirement: React Router Navigation
The application MUST use `react-router-dom` for top-level routing.
- The `App.tsx` file MUST wrap the application in a `<BrowserRouter>`.
- The following exact routes MUST be defined:
  - `<Route path="/" element={<AuthForm />} />`
  - `<Route path="/dashboard" element={<MatchGrid />} />`
  - `<Route path="/leaderboard" element={<LeaderboardPodium />} />`
