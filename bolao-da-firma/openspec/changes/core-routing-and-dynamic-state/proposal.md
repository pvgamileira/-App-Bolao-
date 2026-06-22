## Why

The current application manages views through a single monolithic component (`App.tsx`) with conditional rendering, which doesn't scale and breaks browser history navigation. Furthermore, the application lacks true dark/light mode toggling, fetching real daily matches, and saving user guesses to the database, preventing it from functioning as a complete end-to-end product.

## What Changes

- Implement `react-router-dom` to manage top-level navigation (`/`, `/dashboard`, `/leaderboard`).
- Implement `ThemeContext.tsx` to handle true global Dark/Light mode toggling via Tailwind's `dark` class.
- Refactor `MatchGrid.tsx` to fetch only today's matches from `public.jogos` and pre-fill inputs using user guesses from `public.palpites`.
- Implement a functional "Salvar Meus Palpites" button that writes safely to the database with loading state.
- Update `AuthForm.tsx` to utilize React Router's `useNavigate` for post-login redirection.

## Capabilities

### New Capabilities
- `routing`: Implementation of `react-router-dom` for top-level navigation and URL state management.
- `theme-context`: Global React Context for Dark/Light mode toggling.

### Modified Capabilities
- `matches`: Require fetching dynamic daily matches and saving/upserting guesses to Supabase, including pre-filling logic.
- `auth`: Update to include programmatic routing to `/dashboard` upon successful login.
- `desktop-layout`: Refactor to use a global layout wrapper and top navigation bar, rather than raw conditional rendering in `App.tsx`.

## Impact

- **UI/UX**: Standardized browser navigation (back/forward buttons work), persistent dark mode preference.
- **Frontend Architecture**: Shift from single monolithic file to router-based views.
- **Database / Backend**: Ensures guesses are finally persisted to `public.palpites` and queried dynamically per user.
