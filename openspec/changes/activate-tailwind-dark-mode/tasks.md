## 1. Tailwind Activation

- [x] 1.1 In `tailwind.config.ts`, add the property `darkMode: 'class',` to the top-level configuration object.

## 2. Layout Integration

- [x] 2.1 In `src/components/Layout.tsx`, locate the theme toggle button.
- [x] 2.2 Verify it uses the `useTheme` hook correctly: `const { theme, toggleTheme } = useTheme();`.
- [x] 2.3 Ensure the icon rendered inside the button is `<Moon size={20} />` when `theme === 'light'` and `<Sun size={20} />` when `theme === 'dark'`.
