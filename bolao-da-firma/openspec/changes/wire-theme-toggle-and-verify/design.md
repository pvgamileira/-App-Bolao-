## Context

React Context provides the state, but components must consume it explicitly. The `Layout` component wraps the entire authenticated experience and holds the universal header, making it the perfect home for the global toggle button.

## Goals / Non-Goals

**Goals:**
- Ensure robust event binding between the UI toggle and the Context engine.
- Provide clear visual feedback regarding which mode is active via the Moon/Sun icons.

**Non-Goals:**
- Injecting complex theme persistence algorithms (handled elsewhere by Context).
- Creating new Tailwind colors.

## Decisions

- **Event Binding:** Ensure `<button onClick={toggleTheme}>` is perfectly wired.
- **Icon Swap:** Evaluate the context string `theme` and render the inverse action (if dark, show sun to indicate light mode availability).

## Risks / Trade-offs

- None. This is standard verification of React contextual state mapping.
