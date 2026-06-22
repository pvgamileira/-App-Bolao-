## MODIFIED Requirements

### Requirement: Strict Data Handling and Empty States
The `MatchGrid.tsx` component MUST NOT initialize with mock matches arrays. It MUST initialize with an empty array `[]`.
- If the array of matches is empty after attempting to load data, the UI MUST display a centralized empty state message inside a stylized container: "Nenhum jogo disponível para esta rodada."
