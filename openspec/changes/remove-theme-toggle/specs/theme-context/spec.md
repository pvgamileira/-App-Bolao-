## REMOVED Requirements

### Requirement: Global Dark/Light Mode UI Toggle
**Reason**: The application UI logic currently hardcodes Tailwind CSS dark properties and lacks a true secondary light palette, rendering the manual toggle button broken visually.
**Migration**: Remove the button from the layout. The application remains permanently in Dark Mode implicitly.
