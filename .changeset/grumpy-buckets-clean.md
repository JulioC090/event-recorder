---
"@event-recorder/cli": major
---

feat: add CLI entry point with port support
- Adds a CLI interface using Commander
- Enables launching the backend server via CLI
- Supports the --port option (default: 3001)
- Validates that the provided port is within the valid range (1–65535)
