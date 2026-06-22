## 1. State and Fetch Hooks

- [x] 1.1 In `src/components/MatchGrid.tsx`, import `supabase` and `useEffect`.
- [x] 1.2 Add local state: `usersList`, `selectedPeerId`, and `peerGuesses`.
- [x] 1.3 Add a `useEffect` on mount to fetch `id, nome_guerra` from `usuarios` and populate `usersList`.
- [x] 1.4 Add a `useEffect` that listens to `selectedPeerId`; if valid, fetch from `palpites`, map array into a record keyed by `jogo_id`, and update `peerGuesses`. If empty, clear the map.

## 2. Dropdown UI

- [x] 2.1 Between the Tabs Header and the Matches List, render a styled `<select>` element binding to `selectedPeerId`.
- [x] 2.2 Map `usersList` to `<option>` tags. Include a default empty option: "🔍 Secar palpite de...".

## 3. Card Badge Integration

- [x] 3.1 Inside the `.map(match)` loop, locate the score inputs div wrapper.
- [x] 3.2 Below the wrapper, conditionally render the peer badge: if `selectedPeerId` and `peerGuesses[match.id]` exist.
- [x] 3.3 The badge should display the selected user's name (found via array lookup) and their scores.
