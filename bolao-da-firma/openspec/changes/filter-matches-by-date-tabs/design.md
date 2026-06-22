## Context

The `App.tsx` fetches all relevant upcoming matches (limit 10) ordered chronologically. Instead of complex API-level paginations, we can segment these records logically inside the `MatchGrid` component.

## Goals / Non-Goals

**Goals:**
- Provide a clean "Hoje" vs "Futuros" tab layout.
- Client-side filtering based on the exact string match of the tournament's active date (2026-06-22).
- Retain all prediction, locking, and saving mechanics seamlessly across both tabs.

**Non-Goals:**
- Creating a separate routing page for future matches.

## Decisions

- **Tab State:** Use `const [activeTab, setActiveTab] = useState<'today' | 'future'>('today');`
- **Filtering Logic:** We can format the `match.date` to an ISO string and slice it to get `YYYY-MM-DD`. Since the strict target is `2026-06-22`, we use that as the anchor.
  - `const filteredMatches = matches.filter(m => activeTab === 'today' ? isSameDay(m.date, targetDay) : isAfter(m.date, targetDay))`
  - Let's keep it simple: `const todayStr = '2026-06-22'`. We convert `match.date` to `yyyy-mm-dd` (accounting for UTC) and compare. Wait, the timestamp in DB `2026-06-22T00:00:00Z` might shift locally. Instead, since we know `App.tsx` receives `j.data_hora`, let's just do `match.date.toISOString().startsWith('2026-06-22')` for `today`, and `> '2026-06-22T23:59:59Z'` for `future`.
- **Styling:** The tabs will be a flex container with two buttons, using solid `bg-primary text-background` for active and `border border-gray-700 text-gray-400` for inactive.

## Risks / Trade-offs

- Timezone shifts if we rely strictly on ISO strings vs local Date objects. We will ensure the anchor date comparison is robust by strictly evaluating the UTC ISO string to prevent drop-offs.
