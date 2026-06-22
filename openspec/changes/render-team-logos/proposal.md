## Why

The database and Edge Function have been updated to capture team logo URLs from the ESPN API (`logo_a` and `logo_b`). Rendering these logos in the UI will provide a much richer, professional experience for the users compared to fallback emojis or plain text flags.

## What Changes

- Update the `Match` type in `src/components/MatchGrid.tsx` and the fetch mapper in `src/App.tsx` to handle `logo_a` and `logo_b` properties.
- Modify the `MatchGrid.tsx` component to render an `<img>` tag for the team logos, applying responsive `w-12 h-12 object-contain` styling.
- Keep the fallback styling clean if no logo is available, and use the team's display name as the `alt` attribute.
- Ensure all input states, unlocking logic, and layout stability remain intact.

## Capabilities

### New Capabilities
- `render-team-logos`: Renders external team logos natively within the Match cards.

### Modified Capabilities

## Impact

- `src/App.tsx` (Data Mapper)
- `src/components/MatchGrid.tsx` (Type definition and Image Layout)
