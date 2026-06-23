## ADDED Requirements

### Requirement: Display App Version on Login Screen
The system SHALL display the application version reading from `VITE_APP_VERSION` on the AuthForm screen.

#### Scenario: User visits the Login/Registration page
- **WHEN** the AuthForm component is rendered
- **THEN** a visible tag with the version (e.g., `v1.0.0`) is displayed below the application title

### Requirement: Display App Version in the Main Layout
The system SHALL display the application version reading from `VITE_APP_VERSION` in the main Layout header alongside the application name.

#### Scenario: Authenticated user views the dashboard
- **WHEN** the user is viewing a page using the Layout component
- **THEN** a visible tag with the version is displayed in the header on desktop devices
