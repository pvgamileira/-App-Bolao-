## ADDED Requirements

### Requirement: Global Theme Context
The application MUST implement a global React Context for Dark/Light mode toggling in `src/contexts/ThemeContext.tsx`.
- The context MUST provide `theme` ('dark' or 'light') and a `toggleTheme` function.
- It MUST toggle the `dark` class on the root HTML element.
- The navigation toggle button MUST utilize this context to switch themes.
