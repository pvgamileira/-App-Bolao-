## 1. AuthForm Transformation Refactor

- [x] 1.1 In `src/components/AuthForm.tsx` inside the `handleSubmit` block, define `const normalizedName = nomeGuerra.trim().toUpperCase();`.
- [x] 1.2 In the "CRIAR" block, update the insert payload: `.insert([{ nome_guerra: normalizedName, pin: pin.trim() || null }])`.
- [x] 1.3 In the "ENTRAR" block, update the select query: `.eq('nome_guerra', normalizedName)`.
- [x] 1.4 Upon successful execution of either block, pass `normalizedName` to the success callback: `onLogin(normalizedName)`.
- [x] 1.5 Ensure any UI error messages using the username reflect `normalizedName` if applicable.
