## 1. Global Setup (`ThemeContext` & Dependencies)

- [x] 1.1 Install `react-router-dom` using npm.
- [x] 1.2 Create `src/contexts/ThemeContext.tsx` providing `theme` and `toggleTheme`. Apply the `dark` class to `document.documentElement` internally based on state.
- [x] 1.3 In `src/main.tsx` (or top of `App.tsx`), wrap the application in `<ThemeProvider>`.
- [x] 1.4 Make sure Tailwind is configured for `darkMode: 'class'`.

## 2. React Router Implementation (`App.tsx`)

- [x] 2.1 Refactor `App.tsx` to wrap the app in `<BrowserRouter>`.
- [x] 2.2 Create a `Layout.tsx` component that includes a top navigation bar with the Theme Toggle button and Links to `/dashboard` and `/leaderboard`. Render `children` inside it.
- [x] 2.3 Set up `<Routes>` in `App.tsx`:
  - `<Route path="/" element={<AuthForm />} />`
  - `<Route path="/dashboard" element={<Layout><MatchGrid /></Layout>} />`
  - `<Route path="/leaderboard" element={<Layout><LeaderboardPodium /></Layout>} />`

## 3. Dynamic Daily Matches & Pre-filling (`MatchGrid.tsx`)

- [x] 3.1 Update the `fetchMatches` function to calculate `startOfDay` and `endOfDay` for the current local date.
- [x] 3.2 Update the Supabase `jogos` query to `.gte('data_hora', startOfDay).lte('data_hora', endOfDay)`.
- [x] 3.3 Ensure `fetchUserGuesses` is called on mount for the `/dashboard` route (or within a `useEffect` inside `MatchGrid`) so inputs pre-fill correctly.

## 4. Auth Redirect & Submit Enhancements

- [x] 4.1 In `AuthForm.tsx`, import `useNavigate` and redirect to `/dashboard` upon successful login or account creation.
- [x] 4.2 In `App.tsx` (or `MatchGrid`), add a `isSubmitting` state. 
- [x] 4.3 Update `handleSaveGuesses` to set `isSubmitting = true`, perform the `upsert`, and set to `false`. Disable the "Salvar Meus Palpites" button and show a "Salvando..." text while `isSubmitting` is true.
