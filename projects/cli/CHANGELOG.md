# @event-recorder/cli

## 1.0.1

### Patch Changes

- [`5d5918b`](https://github.com/JulioC090/event-recorder/commit/5d5918bc8f21411c93e254da06f98a6819fafc4e) Thanks [@JulioC090](https://github.com/JulioC090)! - build: fix copy public script

## 1.0.0

### Major Changes

- [`091091f`](https://github.com/JulioC090/event-recorder/commit/091091f8d3e6b0eb1bc8c0c3463e1731d0b87127) Thanks [@JulioC090](https://github.com/JulioC090)! - feat: add CLI entry point with port support
  - Adds a CLI interface using Commander
  - Enables launching the backend server via CLI
  - Supports the --port option (default: 3001)
  - Validates that the provided port is within the valid range (1–65535)
