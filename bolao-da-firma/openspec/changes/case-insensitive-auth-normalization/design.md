## Context

The Supabase database currently expects exact string matches. Rather than altering the database schema to perform ILIKE queries or creating complex backend normalization triggers, a simple client-side string transformation is sufficient for our closed-ecosystem app.

## Goals / Non-Goals

**Goals:**
- Strip leading/trailing whitespaces from the login input.
- Force all alphabetic characters to uppercase before sending the request to Supabase.
- Ensure the React state tracking user feedback correctly echoes the normalized string if needed.

**Non-Goals:**
- Modifying the existing Supabase table records.
- Implementing backend triggers.

## Decisions

- **Client-Side Normalization:** 
  `const normalizedName = nomeGuerra.trim().toUpperCase();`
- **Application:**
  Use `normalizedName` inside the login `.select().eq('nome_guerra', normalizedName)` and registration `.insert([{ nome_guerra: normalizedName, pin: pin.trim() || null }])` calls.
- **Callback Passing:**
  Pass `normalizedName` to `onLogin(normalizedName)` upon successful authentication so the application state uses the proper uppercase name format uniformly.

## Risks / Trade-offs

- The frontend becomes the sole enforcer of case-normalization. If another client connects directly to the DB, it could insert lowercase names. However, this is an internal dashboard without alternative clients, so the risk is negligible.
