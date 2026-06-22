## Context

React applications utilizing Tailwind CSS for dynamic theme switching must explicitly configure Tailwind to evaluate class-level triggers rather than relying strictly on `prefers-color-scheme` OS-level media queries.

## Goals / Non-Goals

**Goals:**
- Enable fully functional class-based dark mode styling.
- Ensure the header toggle button visual states match the expected user interaction pattern.

**Non-Goals:**
- Creating new color palettes or redesigning existing `dark:` classes. The goal is solely to activate what is already defined or will be defined using standard Tailwind patterns.

## Decisions

- **Tailwind Config:** Add `darkMode: 'class',` to the root of the exported config object.
- **Layout Toggle Integration:** Utilize the `useTheme()` hook in `Layout.tsx` to conditionally render the correct Lucide icon (`<Moon />` or `<Sun />`) within the floating header button.

## Risks / Trade-offs

- None. This is standard Tailwind procedure for React theme toggles.
