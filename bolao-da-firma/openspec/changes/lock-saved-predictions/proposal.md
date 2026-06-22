## Why

Currently, users can infinitely overwrite their predictions as long as a match is in the `SCHEDULED` state. However, the system requires a strict flow where once a prediction is submitted and saved, it is locked in forever, adding weight to their choices.

## What Changes

- Implement a native `window.confirm` dialogue before allowing the `.upsert` payload to process in `handleSaveGuesses`.
- Pass a derived state or property down to `MatchGrid` indicating whether a specific match already has an existing saved prediction.
- Update the `disabled` property of the `palpite_a` and `palpite_b` input boxes to lock if `match.status !== 'SCHEDULED'` OR if `hasConfirmedPalpite` is true.
- Render a "✓ Palpite Registrado" badge when a prediction is locked, and hide or disable the "Salvar Meus Palpites" button if there are no more pending eligible matches.

## Capabilities

### New Capabilities
- `lock-saved-predictions`: Freezes input text fields into a read-only state with altered UI styling once a user's prediction has been successfully saved.

### Modified Capabilities

## Impact

- `src/App.tsx` (Save Dialogue and State Flow)
- `src/components/MatchGrid.tsx` (Input Logic and Badges)
