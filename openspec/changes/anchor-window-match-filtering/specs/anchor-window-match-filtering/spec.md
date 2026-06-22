## ADDED Requirements

### Requirement: Block Grouping Evaluation
The match filtering engine SHALL use the chronologically first match as an anchor to determine logical daily blocks rather than strict calendar dates.

#### Scenario: Array is populated with a split block
- **WHEN** the `matches` array contains games at 10:00, 13:00, 16:00, and 23:30 (crossing to 01:30)
- **THEN** the system calculates a 16-hour window from 10:00.
- **AND** groups all 4 matches into the 'today' tab because they fall within that threshold.

#### Scenario: Array is completely empty
- **WHEN** the API sync is still pending and `matches` is `[]`
- **THEN** the system safely bypasses the anchor evaluation and renders the `<EmptyState />`.
