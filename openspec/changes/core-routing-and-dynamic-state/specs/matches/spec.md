## MODIFIED Requirements

### Requirement: Dynamic Daily Data & Guesses
The `MatchGrid.tsx` (or its wrapper in the router) MUST fetch dynamic data daily instead of all data at once.
- The `select` query on `public.jogos` MUST filter where `data_hora` matches today's date (e.g., `>=` start of day and `<=` end of day).
- On mount, it MUST query `public.palpites` for the logged-in user and pre-fill the score inputs if guesses exist.
- The "Salvar Meus Palpites" button MUST execute an `upsert` array payload to `public.palpites`.
- The UI MUST show a "Loading..." state on the button during the transaction and disable the button.
