## 1. State and Fetch Logic

- [x] 1.1 In `src/App.tsx`, introduce a `savedGuesses` state to track which guesses came from the database.
- [x] 1.2 Update `fetchUserGuesses` to populate both `guesses` and `savedGuesses` so we can identify locked matches.
- [x] 1.3 Add `window.confirm("Tem certeza que deseja registrar esses palpites? Após a confirmação, eles não poderão ser alterados.")` to `handleSaveGuesses`. After successful save, refresh the `savedGuesses` state.

## 2. MatchGrid Component Logic

- [x] 2.1 Update `MatchGridProps` to accept `savedGuesses`.
- [x] 2.2 Disable score inputs if `match.status !== 'SCHEDULED'` OR if the match ID exists in `savedGuesses`.
- [x] 2.3 Render a `bg-green-100 text-green-800` badge saying "✓ Palpite Registrado" when the match is locked by `savedGuesses`.

## 3. Global Button

- [x] 3.1 Disable or hide the "Salvar Meus Palpites" button if all currently rendered `SCHEDULED` matches already exist in `savedGuesses`.
