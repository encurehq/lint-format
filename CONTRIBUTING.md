# Contributing

## Prerequisites

- [Bun](https://bun.sh) 1.4.3 or newer. CI pins 1.4.3, the first version with the built-in `bun check` that type checking runs through.
- Nothing else to install globally: `bun install` brings in `oxlint`, `oxfmt`, `oxlint-tsgolint` and `@shadcn/lint` as dev dependencies.

## Develop

```bash
bun install
bun run build
bun run verify   # lint, format check, `bun check` (types), test
```

The aggregate script is `verify`, not `check`, because a `check` script in `package.json` would shadow the built-in `bun check`.

The repo lints and formats itself with its own presets: `oxlint.config.ts` and `oxfmt.config.ts` import `src/lint.ts` and `src/format.ts` directly.

Keep imports of `oxlint`, `oxfmt` and `@shadcn/lint` in `src` type-only (`import type`). The `/lint` and `/format` entries are meant to load without the other tool installed.

## Releasing

Releases are automated with [release-please](https://github.com/googleapis/release-please) in `.github/workflows/release.yml`. The one manual step is merging the release PR, which is where you check the version and changelog before anything reaches npm.

### Flow

1. Merge pull requests into `main` with squash merge and a [Conventional Commits](https://www.conventionalcommits.org) title. The title decides the release:

   | PR title                                       | Before 1.0 | From 1.0   |
   | ---------------------------------------------- | ---------- | ---------- |
   | `feat!:` or a `BREAKING CHANGE:` footer        | minor      | major      |
   | `feat:`                                        | minor      | minor      |
   | `fix:`, `perf:`                                | patch      | patch      |
   | `chore:`, `ci:`, `docs:`, `refactor:`, `test:` | no release | no release |

2. Each push to `main` runs the Release workflow. release-please opens or updates one release PR, `chore(main): release <version>`, which bumps `package.json` and `.release-please-manifest.json` and writes `CHANGELOG.md`. The workflow then runs CI on that PR.
3. **Manual step:** open the release PR, check the version and changelog, and merge it once `check` is green. Leave it open to batch more changes into the same release; release-please keeps updating it.
4. The Release run for that merge tags `v<version>`, creates the GitHub release, and publishes: it checks out the tag, checks it against `package.json`, builds, runs `verify`, then runs `bun publish --access public`.
5. Confirm with `npm view @encure/lint-format version`.

Don't change `version` in `package.json`, `.release-please-manifest.json`, `CHANGELOG.md` or the tags by hand. release-please finds the last release by its `v<version>` GitHub release tag; under any other tag name it misses the release and proposes the same changes again.

### When it gets stuck

- **The release PR's `check` stays "Expected — Waiting for status to be reported", or the PR is behind `main`.** A merge with no releasable commit (`chore:`, `ci:`) doesn't refresh the release PR, so CI doesn't run on it again. Click **Update branch** on the release PR; that push runs CI.
- **The publish job failed after the tag was created.** Fix the cause in a `ci:` or `chore:` PR so no new release starts, then go to Actions → Release → Run workflow and enter the tag (`v<version>`). The job runs the workflow from `main` against the tag's code.
- **A release PR repeats a version that is already published.** Close it without merging, then check that the published release's GitHub tag is `v<version>`.

### Repository setup

Done once; listed here so it can be checked or repeated.

- `NPM_TOKEN` secret: an npm token with publish rights on the `@encure` scope.
- Settings → Actions → General → "Allow GitHub Actions to create and approve pull requests" on.
- Branch protection on `main` requires the `check` status (the job name, not the `CI` workflow name).
- No other token. A release PR opened with `GITHUB_TOKEN` starts no `pull_request` runs, so the Release workflow dispatches `ci.yml` on the release branch itself.
