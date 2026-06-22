## Why

The theme context successfully manages the global state and injects the `.dark` class, but we need to guarantee that the primary user interface control (the theme toggle button in the layout header) correctly broadcasts clicks to the context and renders the appropriate visual indicator (Moon/Sun) mapping to the active state. Additionally, we need to guarantee that Tailwind is actively watching for this class insertion.

## What Changes

- Verify that the `onClick` handler of the theme toggle button in `src/components/Layout.tsx` calls `toggleTheme`.
- Verify the button inner icon dynamically evaluates `theme === 'dark'` to show `<Sun />`, else `<Moon />`.
- Verify `tailwind.config.ts` includes `darkMode: 'class'`.

## Capabilities

### New Capabilities
- `wire-theme-toggle-and-verify`: Validates and secures the dark mode presentation layer connectivity.

### Modified Capabilities

## Impact

- `src/components/Layout.tsx` (Toggle event binding)
- `tailwind.config.ts` (Class strategy)
