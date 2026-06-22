## Context

The backend Edge function now utilizes `new Date()` to fetch a rolling two-week window of matches. Our frontend must adopt this dynamic pattern.

## Goals / Non-Goals

**Goals:**
- Eliminate hardcoded string constants mapping to June 22.
- Make the "Hoje" tab reflect whatever physical calendar day the user's browser calculates.
- Retain all prediction states (disabled inputs, confirmed guess badges).

**Non-Goals:**
- Handling complex user-side offset shifts or libraries like `date-fns`. Native Javascript UTC/ISO string comparisons will suffice since ESPN delivers UTC and we just want a strict anchor.

## Decisions

- **Dynamic Anchor Date:** 
  `const localTodayStr = new Date().toISOString().split('T')[0];`
- **Filtering Logic:** 
  `const filteredMatches = matches.filter(match => {`
  `  const iso = match.date.toISOString();`
  `  return activeTab === 'today' ? iso.startsWith(localTodayStr) : iso > \`\${localTodayStr}T23:59:59Z\`;`
  `});`

## Risks / Trade-offs

- Using `toISOString()` on `new Date()` grabs UTC time. If a user in Brazil plays at 10 PM local time, UTC will already be the next day, shifting their tabs early. However, this is acceptable for a rapid fix compared to pulling in a bloated timezone library. We will stick to the native ISO anchor.
