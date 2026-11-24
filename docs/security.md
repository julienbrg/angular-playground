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
- **Strict compilation.** [`strict`](https://www.typescriptlang.org/tsconfig#strict) is on in [TypeScript](https://www.typescriptlang.org/), along with `noImplicitOverride`, `noImplicitReturns`, `noFallthroughCasesInSwitch` and `noPropertyAccessFromIndexSignature`. On the Angular side, [`strictTemplates`](https://angular.dev/tools/cli/template-typecheck), `strictInjectionParameters` and `strictInputAccessModifiers` catch template and DI mistakes at build time.
- **Closed routing.** The router knows `/` and `/new`, and a wildcard route redirects anything else to `/`.

### Build

- **Production by default.** `ng build` uses the production configuration, with optimization, output hashing on every file and no source maps, so shipped code isn't mapped back to the sources.
- **No inline script.** [Critical CSS inlining](https://angular.dev/reference/configs/workspace-config) is off (`optimization.styles.inlineCritical: false`). It would add an inline `<script>` to `index.html`, so turning it off lets the Content Security Policy keep `script-src 'self'`.
- **No CLI analytics.** [Angular CLI analytics](https://angular.dev/cli/analytics) is set to `false` in `angular.json`, so running the CLI in this repository sends no usage data to Google.
- **Clean tree.** [`.gitignore`](../.gitignore) keeps `dist/`, `node_modules/`, coverage reports and editor settings out of the repository.

### Hosting

- **Content Security Policy.** [`vercel.json`](../vercel.json) sends a [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP) on every path: `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'`. Scripts load only from the site's own origin, with no inline script and no `eval`. Plugins are blocked, `<base>` and form targets can't leave the origin, and no other site can frame the app.
- **Hardening headers.** The same file sets `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` and a `Permissions-Policy` that turns off the camera, microphone, geolocation, payment, USB and other browser features the app doesn't use.
- **HTTPS only.** Vercel serves the `*.vercel.app` domain with `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`, and the domain is on the browser [HSTS preload list](https://vercel.com/docs/cdn-security/encryption).
- **Client-side routing.** A rewrite sends every path that isn't a file to `index.html`, so the Angular router handles deep links such as `/new`, and the headers apply to them too.

### Dependencies

- **Supported framework.** Angular 22 is the active major on the [release schedule](https://angular.dev/reference/releases), with long-term support until June 2028. [`pnpm audit --prod`](https://pnpm.io/cli/audit) reports no known vulnerabilities in runtime dependencies.
- **Committed lockfile.** [pnpm](https://pnpm.io/) is the package manager, and `pnpm-lock.yaml` pins the full dependency tree, so every install resolves the same versions. `cli.packageManager` in `angular.json` makes `ng update` and `ng add` install with pnpm too.
- **No accidental publishing.** [`"private": true`](https://docs.npmjs.com/cli/configuring-npm/package-json#private) in `package.json` stops the package from being published to the npm registry.

### Repository

- **Secret scanning.** [GitHub secret scanning](https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning) is enabled, together with [push protection](https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection), which blocks pushes containing recognized credentials. [GitGuardian](https://www.gitguardian.com/) also scans every pull request for secrets.
- **Private vulnerability reporting.** [Private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/working-with-repository-security-advisories/configuring-private-vulnerability-reporting-for-a-repository) is enabled, so security issues can be reported confidentially from the repository's Security tab (see [below](#reporting-a-vulnerability)).
- **Build on every push.** [Vercel](https://vercel.com/) builds each pull request and deploys it to a preview URL, so a change that breaks the production build shows up before merge. Previews sit behind [Vercel Authentication](https://vercel.com/docs/deployment-protection/methods-to-protect-deployments/vercel-authentication), so only signed-in members of the Vercel team can open them.
- **Tests and audit in CI.** The [`ci`](../.github/workflows/ci.yml) [GitHub Actions](https://docs.github.com/en/actions) job runs on every pull request and every push to `main`. On Node 24 it installs with `pnpm install --frozen-lockfile`, runs `pnpm audit --prod --audit-level high`, runs the unit tests in headless Chrome and builds for production. The workflow's `GITHUB_TOKEN` is [read-only](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions#using-secrets) (`contents: read`), checkout doesn't persist credentials, and each action is pinned to a full commit SHA.
- **Protected `main`.** The `hug-flow` [repository ruleset](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets) on the default branch requires a pull request before merging, accepts squash merges only and requires the `ci` check to pass. The branch doesn't have to be up to date with `main` first. It blocks force pushes and deletion of the branch, and nobody can bypass it. It requires no review approvals.

## Known gaps

| Gap                                                                                                                                                                             | Impact                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build and tests still run on the deprecated webpack-based builders (`@angular-devkit/build-angular:browser` and `:karma`)                                                       | Counting dev tooling, `pnpm audit` reports 3 advisories that don't ship in the bundle: a high and a moderate in `picomatch`, pulled in by the dev server, and a low in `@babel/core`, pulled in by test coverage. Migrating to the [application builder](https://angular.dev/tools/cli/build-system-migration) drops the webpack stack.                                                  |
| [Dependabot alerts](https://docs.github.com/en/code-security/dependabot/dependabot-alerts/about-dependabot-alerts) and security updates are off                                 | New advisories against the dependency tree go unnoticed between CI runs, and nothing opens a fix.                                                                                                                                                                                                                                                                                        |
| No [Dependabot version updates](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/keeping-your-actions-up-to-date-with-dependabot) for GitHub Actions | The actions in `ci.yml` are pinned to commit SHAs, so they stay on the pinned version until someone bumps them by hand, security fixes included.                                                                                                                                                                                                                                         |
| The required `ci` check isn't tied to the GitHub Actions app                                                                                                                    | The ruleset matches the check by name only, so [any person or integration with write access](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets#require-status-checks-to-pass-before-merging) can set a passing `ci` status. Selecting the GitHub Actions app as the expected source closes this. |
| `style-src` allows `'unsafe-inline'`                                                                                                                                            | Angular inserts component styles as `<style>` elements at runtime, and a static Vercel deployment can't send a per-request nonce. Injected CSS can't run script, but it isn't blocked. An edge function issuing a nonce through [`ngCspNonce`](https://angular.dev/best-practices/security#content-security-policy) would remove the exception.                                          |

## Reporting a vulnerability

Don't open a public issue. Report it privately through the repository's [Report a vulnerability](https://github.com/julienbrg/angular-playground/security/advisories/new) form, with a description of the issue and steps to reproduce it. The form needs a GitHub account, and the report stays private between you and the maintainer. See [privately reporting a security vulnerability](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability) for how it works.

## Further reading

- [Angular security guide](https://angular.dev/best-practices/security)
- [MDN Content Security Policy guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)
- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
- [GitHub code security documentation](https://docs.github.com/en/code-security)
