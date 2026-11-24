---
title: Security
description: Security practices in place on Angular Playground, the known gaps, and how to report a vulnerability.
date: 2026-11-24
locale: en_US
author: Julien Béranger
model: Claude Opus 5.5
---

## Scope

Angular Playground is a client-only [single-page application](https://en.wikipedia.org/wiki/Single-page_application) built with [Angular](https://angular.dev/) 22. It has no backend, makes no HTTP calls, has no forms, stores nothing in the browser and holds no secrets. Its attack surface is limited to the static bundle and the dependencies that build it.

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

- **Supported framework.** Angular 22 is the active major on the [release schedule](https://angular.dev/reference/releases), with long-term support until June 2028. [`pnpm audit --prod`](https://pnpm.io/cli/audit) reports no known vulnerabilities in runtime dependencies.
- **Committed lockfile.** [pnpm](https://pnpm.io/) is the package manager, and `pnpm-lock.yaml` pins the full dependency tree, so every install resolves the same versions. `cli.packageManager` in `angular.json` makes `ng update` and `ng add` install with pnpm too.
- **No accidental publishing.** [`"private": true`](https://docs.npmjs.com/cli/configuring-npm/package-json#private) in `package.json` stops the package from being published to the npm registry.

### Repository

- **Secret scanning.** [GitHub secret scanning](https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning) is enabled, together with [push protection](https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection), which blocks pushes containing recognized credentials. [GitGuardian](https://www.gitguardian.com/) also scans every pull request for secrets.
- **Private vulnerability reporting.** [Private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/working-with-repository-security-advisories/configuring-private-vulnerability-reporting-for-a-repository) is enabled, so security issues can be reported confidentially from the repository's Security tab (see [below](#reporting-a-vulnerability)).
- **Build on every push.** [Vercel](https://vercel.com/) builds each pull request and deploys it to a preview URL, so a change that breaks the production build shows up before merge.
- **Tests and audit in CI.** The [`ci`](../.github/workflows/ci.yml) [GitHub Actions](https://docs.github.com/en/actions) job runs on every pull request and every push to `main`. On Node 24 it installs with `pnpm install --frozen-lockfile`, runs `pnpm audit --prod --audit-level high`, runs the unit tests in headless Chrome and builds for production. The workflow's `GITHUB_TOKEN` is [read-only](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions#using-secrets) (`contents: read`), checkout doesn't persist credentials, and each action is pinned to a full commit SHA.
- **Protected `main`.** A [repository ruleset](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets) on the default branch requires a pull request before merging, accepts squash merges only and requires the `ci` check from GitHub Actions to pass. It blocks force pushes and deletion of the branch, and nobody can bypass it. It requires no review approvals.

## Known gaps

| Gap | Impact |
| --- | --- |
| Build and tests still run on the deprecated webpack-based builders (`@angular-devkit/build-angular:browser` and `:karma`) | Counting dev tooling, `pnpm audit` reports 3 advisories that don't ship in the bundle: a high and a moderate in `picomatch`, pulled in by the dev server, and a low in `@babel/core`, pulled in by test coverage. Migrating to the [application builder](https://angular.dev/tools/cli/build-system-migration) drops the webpack stack. |
| [Dependabot alerts](https://docs.github.com/en/code-security/dependabot/dependabot-alerts/about-dependabot-alerts) and security updates are off | New advisories against the dependency tree go unnoticed. |
| No [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) or security headers | Vercel serves the bundle with its default headers. A `vercel.json` could add a CSP and the usual hardening headers. |

## Reporting a vulnerability

Don't open a public issue. Report it privately through the repository's [Report a vulnerability](https://github.com/julienbrg/angular-playground/security/advisories/new) form, with a description of the issue and steps to reproduce it. The form needs a GitHub account, and the report stays private between you and the maintainer. See [privately reporting a security vulnerability](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability) for how it works.

## Further reading

- [Angular security guide](https://angular.dev/best-practices/security)
- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
- [GitHub code security documentation](https://docs.github.com/en/code-security)
