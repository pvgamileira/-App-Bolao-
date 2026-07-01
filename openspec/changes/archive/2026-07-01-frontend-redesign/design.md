## Context

The current application UI is functional but lacks a premium, engaging look and feel. As we prepare to introduce SaaS capabilities (like multitenancy and league management), we need a robust and stunning presentation layer. This redesign aims to elevate the aesthetic quality of the app to modern standards without altering the underlying logic, preparing the ground for future feature development.

## Goals / Non-Goals

**Goals:**
- Completely redesign the presentation layer using modern TailwindCSS utilities.
- Implement a cohesive design system (typography, colors, spacing).
- Add micro-interactions (e.g., hover states, transition animations).
- Refactor existing components (`App.tsx`, `MatchGrid.tsx`, `LeaderboardPodium.tsx`, etc.) to use the new design system.

**Non-Goals:**
- Do NOT change any React state management (`useState`, `useEffect`).
- Do NOT change any Supabase data fetching, real-time subscriptions, or authentication logic.
- Do NOT add new features (e.g., creating leagues) in this phase.

## Decisions

- **TailwindCSS for Styling**: We will continue using TailwindCSS but establish strict conventions for a "sleek dark mode" theme (e.g., `bg-slate-900`, `text-slate-100`, accent colors like `teal-500` or `indigo-500`).
- **Glassmorphism Elements**: Critical floating elements (like the navigation bar or modals) will use backdrop-blur (`backdrop-blur-md bg-opacity-70`) to create depth.
- **Micro-animations**: We will heavily utilize Tailwind's transition classes (`transition-all duration-300 ease-in-out hover:scale-105`) to make elements feel responsive.
- **Separation of Concerns**: We will strictly target the `className` attributes and return structures of React components, ensuring that hooks and business logic remain untouched.

## Risks / Trade-offs

- **Risk: Breaking Component Layouts** → Mitigation: We will implement changes component by component, verifying the layout on different screen sizes (mobile and desktop).
- **Risk: Accidentally altering logic** → Mitigation: We will only modify JSX return blocks and CSS files. No changes will be made to event handlers or data processing logic.
