## Context

The application is moving from a single monolithic view managed by conditional state (`currentView` string) to a standard React web application with routable URLs and a global theme context. We also need to restrict fetched matches to the current day, preventing the UI from being overloaded with past and future games, and correctly pre-fill/save the user's guesses.

## Goals / Non-Goals

**Goals:**
- Setup `react-router-dom` to handle `/`, `/dashboard`, and `/leaderboard`.
- Implement a true React Context `ThemeContext` that controls a `dark` class on the `<html>` element.
- Create a reusable `<Layout>` component for authenticated users that houses the Top Navigation.
- Refactor `MatchGrid` and `App` so the query to `jogos` uses dynamic dates (today) and `palpites` are explicitly queried on mount for pre-filling.

**Non-Goals:**
- Implementing a robust date-picker for users to select different days. We only focus on "today".
- Refactoring the entire styling system. We stick to Tailwind CSS toggling via the `dark:` prefix or a custom `dark` body class mapping.

## Decisions

- **React Router:** We will define routes within `App.tsx` utilizing `<BrowserRouter>`. Unauthenticated users hitting `/dashboard` or `/leaderboard` will not see data (or should be redirected), but for simplicity, the `<Layout>` will hide navigation elements if `currentUserId` is missing, and `AuthForm` will enforce login.
- **ThemeContext:** We will create `src/contexts/ThemeContext.tsx` using `createContext` and `useContext`. The `ThemeProvider` will wrap the `<BrowserRouter>`. The context will read `localStorage` for user preference and apply `document.documentElement.classList.toggle('dark')`.
- **Dynamic Fetching:** In the `fetchMatches` function, we'll generate today's start and end ISO strings:
  ```ts
  const today = new Date();
  const startOfDay = new Date(today.setHours(0,0,0,0)).toISOString();
  const endOfDay = new Date(today.setHours(23,59,59,999)).toISOString();
  // .gte('data_hora', startOfDay).lte('data_hora', endOfDay)
  ```
- **Upsert Guesses:** The `handleSaveGuesses` function will set an `isSubmitting` state to true, perform the `upsert`, and set it to false, updating the UI button to show "Loading..." or similar.

## Risks / Trade-offs

- **[Risk] Date Handling Timezones:** Supabase stores dates in UTC. Filtering by "today" locally might fetch matches slightly off if the user's timezone differs drastically from UTC.
  - *Mitigation:* We will rely on local browser time for the start/end of day and query against `data_hora` (`TIMESTAMPTZ`), which Supabase handles cleanly.
- **[Risk] Unprotected Routes:** If users manually navigate to `/dashboard` without being logged in, they might see broken UI if state is missing.
  - *Mitigation:* We will implement a quick redirect or fallback in `MatchGrid` or `Layout` if `currentUserId` is null.
