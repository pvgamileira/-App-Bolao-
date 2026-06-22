## Context

We now have access to rich image URLs for team logos in our `public.jogos` table, synced from the ESPN API. The `MatchGrid` UI currently uses a placeholder flag. We must replace this placeholder with a clean image element.

## Goals / Non-Goals

**Goals:**
- Render `logo_a` and `logo_b` inside the `MatchGrid`.
- Ensure images are styled cleanly using Tailwind CSS (`object-contain`).
- Keep existing form and locking mechanics exactly as they are.

**Non-Goals:**
- Completely redesigning the Match card.

## Decisions

- **Image Rendering:** Replace the `<span className="text-3xl">{match.timeAFlag}</span>` placeholder with `<img src={match.logo_a} alt={match.timeA} className="w-12 h-12 object-contain" />`. Add a fallback to the placeholder if the logo is missing.
- **Type Definitions:** Extend the `Match` type in `MatchGrid.tsx` to include `logoA?: string | null` and `logoB?: string | null`. Update the `formattedMatches` mapper in `App.tsx` to read `j.logo_a` and `j.logo_b`.

## Risks / Trade-offs

- External images can fail to load. A fallback `img` error handler or simply checking if the logo URL exists before rendering will mitigate broken image icons.
