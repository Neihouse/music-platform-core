# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2024-02-19

### Fixed

- Clean up package.json formatting and structure
- Remove caret (^) for exact version locking to ensure consistent installs
- Fix dependency conflicts with React and Next.js versions

### Changed

- Update to compatible versions:
  - Next.js 14.1.0 (from 15.1.7)
  - React 18.2.0 (from 19.0.0)
  - Mantine 7.17.0
  - Supabase latest stable
- Switch to @supabase/ssr from deprecated auth helpers
- Remove unnecessary auth packages (bcrypt, jsonwebtoken, jose)

### Added

- Proper TypeScript types for all dependencies
- Explicit versioning for all packages
- Development dependencies with exact versions

### Security

- Update dependencies to latest stable versions
- Remove potentially conflicting authentication packages
