## Context

To enhance the game mechanics, predictions must be permanent. Once the user commits to a guess by hitting save, they shouldn't be able to change it. This requires freezing the inputs and providing clear visual feedback that their guess is registered.

## Goals / Non-Goals

**Goals:**
- Trigger a confirmation dialog before saving guesses.
- Disable inputs and remove focus styles for matches that have already been predicted.
- Render a green "✓ Palpite Registrado" badge on completed matches.
- Hide/Disable the main action button if all active matches have been predicted.

**Non-Goals:**
- Creating a complex custom modal for the confirmation. A native `window.confirm` is sufficient.

## Decisions

- **State Management:** In `App.tsx`, we already fetch `palpites` into a `guesses` record. We need a way to distinguish between "local unsubmitted guess" and "saved confirmed guess". A simple way is to use an additional state like `savedGuesses` which keeps track of the original DB values, or pass a boolean flag to `MatchGrid`. Let's extend `guesses` fetch to populate a `savedGuesses` record. Then we compare.
- **UI Feedback:** If a `match.id` exists in `savedGuesses`, disable its inputs, remove hover/focus rings by applying neutral background styles, and show the badge.

## Risks / Trade-offs

- Relying on `window.confirm` is slightly disruptive but guarantees user attention without heavy UI libraries.
- We must accurately track which matches have saved guesses versus which ones are just typed but unsaved.
