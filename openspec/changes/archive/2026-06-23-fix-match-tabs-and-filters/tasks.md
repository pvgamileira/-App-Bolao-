## 1. MatchGrid State Management

- [x] 1.1 Rename `activeTab` state value 'future' to 'all_matches' throughout the component.
- [x] 1.2 Add state variables `startDate` and `endDate` initialized to empty strings.
- [x] 1.3 Update tab button text from "Jogos Futuros" to "Todos os Jogos".

## 2. Match Filtering Logic

- [x] 2.1 Update the filter logic for the 'today' tab to evaluate if a match falls within the current calendar day (`new Date()`).
- [x] 2.2 Update the filter logic for the 'all_matches' tab to evaluate the `startDate` and `endDate` states, displaying all matches if dates are unselected.

## 3. UI and Date Pickers

- [x] 3.1 Render `<input type="date" />` selectors for Start Date and End Date within the 'Todos os Jogos' tab context.
- [x] 3.2 Ensure the date selectors bind correctly to their respective state variables.

## 4. Verification

- [x] 4.1 Verify that games happening "today" (based on the user's system clock) are shown in the first tab.
- [x] 4.2 Verify that the date pickers successfully restrict the matches shown in the second tab.
