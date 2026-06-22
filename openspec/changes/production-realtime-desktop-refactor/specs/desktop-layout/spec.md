## ADDED Requirements

### Requirement: Desktop Dashboard Layout
The main application shell (`App.tsx`) MUST utilize a responsive layout structure.
- For viewports < 768px (mobile), the layout remains a single column, switching between Views (Matches / Leaderboard) with bottom navigation.
- For viewports >= 768px (desktop), the layout MUST transform to display `MatchGrid`/`AuthForm` on the left and `LeaderboardPodium` permanently on the right side.
- The maximum width of the application container MUST be bounded (e.g., `max-w-6xl mx-auto px-4`) to prevent UI elements from stretching too wide on very large monitors.
