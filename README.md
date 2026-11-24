# Angular Playground

An Angular 22 application, deployed on Vercel.

## Requirements

- [Node.js](https://nodejs.org/) 22.22.3+ or 24.15.0+
- [pnpm](https://pnpm.io/)

## Install

    pnpm install

## Develop

    pnpm start

The development server runs at http://localhost:4200/ and reloads on change.

## Test

    pnpm test --watch=false --browsers=ChromeHeadless

## Lint and format

    pnpm lint
    pnpm format:check

`pnpm format` rewrites the files with Prettier.

## Build

    pnpm build

The output is written to `dist/`.

## Continuous integration

Every pull request and every push to `main` runs a frozen-lockfile install, `pnpm audit --prod --audit-level high`, `pnpm lint`, `pnpm format:check`, the unit tests and a production build.
`main` accepts changes only through squash-merged pull requests whose `ci` check passes.

## Security

Practices and known gaps are listed in [docs/security.md](docs/security.md).
Report a vulnerability privately through the
[security advisory form](https://github.com/julienbrg/angular-playground/security/advisories/new),
as described in [SECURITY.md](SECURITY.md).

Vercel serves a Content Security Policy and hardening headers, defined in [vercel.json](vercel.json).

## Contact

Questions or feedback? Get in touch with [Julien](https://github.com/julienbrg): [https://julienberanger.com/contact](https://julienberanger.com/contact)
