## ADDED Requirements

### Requirement: Tailwind Class Response
The system SHALL apply all `dark:` prefixed utility classes whenever the `.dark` class is present on the document root.

#### Scenario: User toggles to dark mode
- **WHEN** the user clicks the theme toggle button and Context injects the `.dark` class
- **THEN** Tailwind natively applies the dark UI shifts.

### Requirement: Icon State Reflection
The Layout component SHALL display an intuitive icon mapping to the *target* state of the toggle.

#### Scenario: Light Mode is Active
- **WHEN** the current theme is light
- **THEN** the button displays a Moon icon to indicate switching to dark mode.

#### Scenario: Dark Mode is Active
- **WHEN** the current theme is dark
- **THEN** the button displays a Sun icon to indicate switching to light mode.
