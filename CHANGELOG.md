# Changelog

## [Unreleased]

### Added

- Homepage with black background, white text and brand colors (purple `#8c1c84`, blue `#45a2f8`)
- Fixed header with "Angular Playground" title and a burger menu
- `/new` page, linked from the menu
- Security documentation in `docs/security.md`
- Private vulnerability reporting enabled, linked from `docs/security.md`
- `SECURITY.md` security policy pointing to the reporting form
- GitHub Actions `ci` workflow on pull requests and pushes to `main`: frozen-lockfile install, `pnpm audit --prod --audit-level high`, headless unit tests and a production build, with a read-only token and SHA-pinned actions
- Ruleset on `main`: pull request required, squash merges only, `ci` check required, force pushes and deletion blocked, no review approvals required

### Changed

- Angular CLI analytics disabled in `angular.json`
- Angular upgraded from 16 to 22, one major at a time with `ng update`: TypeScript 6.0, zone.js 0.15, block control flow in templates, explicit zone change detection, and `baseUrl`/`downlevelIteration` removed from `tsconfig.json`
- Package manager switched from npm to pnpm: `pnpm-lock.yaml` replaces `package-lock.json`, and `angular.json` sets `cli.packageManager` to `pnpm`
- README commands use pnpm

### Security

- Runtime advisories in `@angular/core`, `@angular/compiler`, `@angular/common` and `@angular/router` fixed by the Angular upgrade; `pnpm audit --prod` reports no known vulnerabilities
