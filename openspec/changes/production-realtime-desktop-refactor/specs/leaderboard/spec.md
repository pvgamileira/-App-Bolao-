## MODIFIED Requirements

### Requirement: Leaderboard Empty and Loading States
The `LeaderboardPodium.tsx` MUST NOT initialize with mock user rankings.
- While fetching, it MUST display minimalist loading skeletons for the podium and list items.
- If no users are found, it MUST display a clean empty state message.
