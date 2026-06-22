## 1. Data Fetching Overhaul

- [x] 1.1 In `src/App.tsx`, remove the JavaScript-level `filter` that restricts by strict substring matching. Fetch with `.order('data_hora', { ascending: true }).limit(10)`.

## 2. Unlocked Interactive Mechanics

- [x] 2.1 Verify `src/components/MatchGrid.tsx` uses only `match.status !== 'SCHEDULED'` to disable inputs. Strip any `new Date()` logic used for locking.

## 3. Form Submission Verification

- [x] 3.1 Verify `handleSaveGuesses` uses `.upsert` with `{ onConflict: 'usuario_id,jogo_id' }` correctly.
