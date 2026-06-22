## DELETED Requirements

### Requirement: Client-Side Scoring Logic
The system SHALL NOT use `src/utils/scoreCalculator.ts` as the source of truth for user scores, since the logic has been ported to the database trigger `update_user_points_on_match_finish`. The client-side logic MAY be retained for optimistic UI updates or previews, but it is no longer the definitive calculator.
