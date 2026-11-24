---
title: Security
description: Security practices in place on Angular Playground, the known gaps, and how to report a vulnerability.
date: 2026-11-24
locale: en_US
author: Julien Béranger
model: Claude Opus 5.5
---

## Scope

Angular Playground is a client-only [single-page application](https://en.wikipedia.org/wiki/Single-page_application) built with [Angular](https://angular.dev/) 16. It has no backend, makes no HTTP calls, has no forms, stores nothing in the browser and holds no secrets. Its attack surface is limited to the static bundle and the dependencies that build it.

## Practices in place

### Application

- **Built-in sanitization.** Templates only use interpolation and property binding, so Angular's [contextual escaping](https://angular.dev/best-practices/security) applies everywhere. The codebase has no `innerHTML` binding, no `DomSanitizer.bypassSecurityTrust*` call and no `eval`, which closes the usual [cross-site scripting](https://en.wikipedia.org/wiki/Cross-site_scripting) paths.
- **Strict compilation.** [`strict`](https://www.typescriptlang.org/tsconfig#strict) is on in [TypeScript](https://www.typescriptlang.org/), along with `noImplicitReturns`, `noFallthroughCasesInSwitch` and `noPropertyAccessFromIndexSignature`. On the Angular side, [`strictTemplates`](https://angular.dev/tools/cli/template-typecheck), `strictInjectionParameters` and `strictInputAccessModifiers` catch template and DI mistakes at build time.
- **Closed routing.** The router knows `/` and `/new`, and a wildcard route redirects anything else to `/`.

### Build

- **Production by default.** `ng build` uses the production configuration, with optimization, output hashing on every file and no source maps, so shipped code isn't mapped back to the sources.
- **No CLI analytics.** [Angular CLI analytics](https://angular.dev/cli/analytics) is set to `false` in `angular.json`, so running the CLI in this repository sends no usage data to Google.
- **Clean tree.** [`.gitignore`](../.gitignore) keeps `dist/`, `node_modules/`, coverage reports and editor settings out of the repository.

### Dependencies

- **Committed lockfile.** `package-lock.json` pins the full dependency tree, so every install resolves the same versions.
- **No accidental publishing.** [`"private": true`](https://docs.npmjs.com/cli/configuring-npm/package-json#private) in `package.json` stops the package from being published to the npm registry.

### Repository

- **Secret scanning.** [GitHub secret scanning](https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning) is enabled, together with [push protection](https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection), which blocks pushes containing recognized credentials. [GitGuardian](https://www.gitguardian.com/) also scans every pull request for secrets.
- **Build on every push.** [Vercel](https://vercel.com/) builds each pull request and deploys it to a preview URL, so a change that breaks the production build shows up before merge.

## Known gaps

| Gap | Impact |
| --- | --- |
| Angular 16 is past its [support window](https://angular.dev/reference/releases) | [`npm audit`](https://docs.npmjs.com/cli/commands/npm-audit) reports 4 high-severity advisories in runtime packages: XSS and sanitization bypasses in `@angular/core` and `@angular/compiler`, an XSRF token leak in `@angular/common`, and SSR denial of service in `@angular/router`. Only a major upgrade fixes them. Counting dev tooling, the audit reports 49 advisories, 2 of them critical. |
| [Dependabot alerts](https://docs.github.com/en/code-security/dependabot/dependabot-alerts/about-dependabot-alerts) and security updates are off | New advisories against the dependency tree go unnoticed. |
| No tests or audit in CI, and no [branch protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches) on `main` | Unit tests and `npm audit` don't run on pull requests, and nothing requires the checks to pass before a merge. |
| No [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) or security headers | Vercel serves the bundle with its default headers. A `vercel.json` could add a CSP and the usual hardening headers. |
| [Private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability) is off | There's no confidential channel built into the repository. |

## Reporting a vulnerability

Don't open a public issue. Contact the maintainer, [julienbrg](https://github.com/julienbrg), privately on GitHub, with a description of the issue and steps to reproduce it.

## Further reading

- [Angular security guide](https://angular.dev/best-practices/security)
- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
- [GitHub code security documentation](https://docs.github.com/en/code-security)
