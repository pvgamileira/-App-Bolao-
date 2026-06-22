## Why

The application has a functioning `ThemeContext.tsx` that successfully injects the `dark` class onto the HTML root element. However, Tailwind CSS requires a specific configuration flag (`darkMode: 'class'`) to actively listen for this class injection and apply `dark:` utility variants across the DOM. Without it, the UI remains permanently frozen in the default theme despite the toggle state changing.

## What Changes

- Inject `darkMode: 'class'` into `tailwind.config.ts`.
- Verify the header toggle button within `src/components/Layout.tsx` accurately reflects the action context (showing a Moon when in light mode, and a Sun when in dark mode).

## Capabilities

### New Capabilities
- `activate-tailwind-dark-mode`: Enables the entire UI to respond to `.dark` class injections.

### Modified Capabilities

## Impact

- `tailwind.config.ts` (Configuration flag addition)
- `src/components/Layout.tsx` (Toggle icon evaluation)
