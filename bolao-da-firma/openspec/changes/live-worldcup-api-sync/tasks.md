## 1. Database Schema Update

- [x] 1.1 Create SQL migration script to add `api_id` column to `public.jogos`
- [ ] 1.2 Run migration to alter `public.jogos` table, adding `api_id INT UNIQUE`

## 2. Supabase Edge Function

- [x] 2.1 Scaffold `sync-worldcup` Deno Edge Function in `supabase/functions/sync-worldcup`
- [x] 2.2 Implement API fetching logic (with dummy endpoint or actual sports API config) utilizing `Deno.env.get('SPORTS_API_KEY')`
- [x] 2.3 Implement mapping of JSON payload to our database schema
- [x] 2.4 Implement `upsert` logic using Supabase Admin Client and `api_id` as conflict resolution key
- [x] 2.5 Add robust error handling (try/catch) and return standard JSON response

## 3. Frontend Resiliency Updates

- [x] 3.1 Update `src/components/MatchGrid.tsx` to read the `status` field of a match
- [x] 3.2 Modify prediction inputs to be disabled when `status === 'LIVE'` or `status === 'FINISHED'`
- [x] 3.3 Add visual indicator (e.g., blinking badge) when `status === 'LIVE'`
- [x] 3.4 Display final official score prominently when `status === 'FINISHED'`

## 4. Verification

- [x] 4.1 Test the SQL migration script (verify column exists and is unique)
- [x] 4.2 Invoke `sync-worldcup` locally using `supabase functions serve` and verify upsert behavior
- [x] 4.3 Verify `MatchGrid.tsx` behavior by manually setting match statuses to `LIVE` and `FINISHED` in the database
