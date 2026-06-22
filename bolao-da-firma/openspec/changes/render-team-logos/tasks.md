## 1. Type and Mapper Updates

- [x] 1.1 In `src/components/MatchGrid.tsx`, update the `Match` type to include `logoA?: string | null` and `logoB?: string | null`.
- [x] 1.2 In `src/App.tsx`, update the `fetchMatches` mapper to bind `logoA: j.logo_a` and `logoB: j.logo_b`.

## 2. UI Injection

- [x] 2.1 In `src/components/MatchGrid.tsx`, replace the placeholder text spans with `<img>` tags for both Team A and Team B.
- [x] 2.2 Verify Tailwind styling (`w-12 h-12 object-contain`) and `alt` attributes on the logos.
