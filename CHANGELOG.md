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
- `hug-flow` ruleset on `main`: pull request required, squash merges only, `ci` check required, force pushes and deletion blocked, no review approvals required
- `vercel.json` with a Content Security Policy (`script-src 'self'`, `style-src 'self' 'unsafe-inline'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`), `X-Content-Type-Options`, `Referrer-Policy` and `Permissions-Policy` on every path, plus a fallback rewrite to `index.html` for client-side routes
- ESLint through angular-eslint: flat `eslint.config.js` with the TypeScript, template and template accessibility recommended presets, and `pnpm lint` (`ng lint`)
- Prettier with the Angular CLI's default `.prettierrc` (`printWidth` 100, single quotes, `angular` parser for HTML) and `eslint-config-prettier`, plus `pnpm format` and `pnpm format:check`
- `pnpm lint` and `pnpm format:check` steps in the `ci` workflow
- README lint and format section

### Changed

- Angular CLI analytics disabled in `angular.json`
- Angular upgraded from 16 to 22, one major at a time with `ng update`: TypeScript 6.0, zone.js 0.15, block control flow in templates, explicit zone change detection, and `baseUrl`/`downlevelIteration` removed from `tsconfig.json`
- Package manager switched from npm to pnpm: `pnpm-lock.yaml` replaces `package-lock.json`, and `angular.json` sets `cli.packageManager` to `pnpm`
- README commands use pnpm
- README rewritten: requirements, install, develop, test, build, continuous integration, security and contact sections
- Critical CSS inlining disabled in the production build, so `index.html` has no inline script
- `docs/security.md` refreshed after the security hardening track: hosting headers documented, Vercel preview protection, ruleset and compiler options updated; known gaps now list the webpack builders, Dependabot alerts and Actions updates, the unpinned `ci` check source and inline styles in the CSP
- Codebase formatted with Prettier
- Components use the default `OnPush` change detection instead of `Eager`, and `AppComponent` injects `ElementRef` with `inject()`
- `@angular-eslint/prefer-standalone` turned off while the app still uses NgModules

### Security

- Runtime advisories in `@angular/core`, `@angular/compiler`, `@angular/common` and `@angular/router` fixed by the Angular upgrade; `pnpm audit --prod` reports no known vulnerabilities
