## Context

The MatchGrid component currently filters the "Today" and "Future" tabs based on a 16-hour window starting from the first match's timestamp in the dataset. This causes the UI to always display the first day of the tournament as "Today," ignoring the real-world current date. We need to implement dynamic filtering based on `new Date()`, rename the "Future" tab to "All Matches", and add custom date-range filtering.

## Goals / Non-Goals

**Goals:**
- Replace static start-date filtering for "Jogos de Hoje" with a dynamic filter evaluating the real-world start and end of the current day.
- Add a new state for a date-range filter (start date, end date).
- Apply the date range to "Todos os Jogos". If no dates are selected, all matches are shown.

**Non-Goals:**
- Modifying the backend database logic or fetching procedures.
- Changing the save guess or user restrictions functionalities.

## Decisions

**1. Filtering logic for 'Jogos de Hoje'**
- **Decision:** Use `new Date()` to find the local start of the day (00:00) and end of the day (23:59:59). Match dates falling within this range will be mapped to the 'today' tab.
- **Rationale:** Ensures accuracy across users and matches the real-world definition of "Today".

**2. Date Range State**
- **Decision:** Introduce two new pieces of state in `MatchGrid`: `startDate: string` and `endDate: string` via `<input type="date" />`.
- **Rationale:** Standard and straightforward UI mechanism. HTML5 date inputs are responsive and well-supported on mobile.

**3. Fallback for 'Todos os Jogos' Filter**
- **Decision:** If `startDate` or `endDate` are empty, do not restrict that boundary. If both are empty, show the entire match array.

## Risks / Trade-offs

- **Risk:** Timezone mismatches between the user's browser and the match dates.
  - **Mitigation:** Rely on standard Javascript Date objects which map to the local system timezone. Matches parsed from the database should already be adjusted if stored as ISO strings.
