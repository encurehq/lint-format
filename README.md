# @encure/lint-format

Shared [oxlint](https://oxc.rs/docs/guide/usage/linter) and [oxfmt](https://oxc.rs/docs/guide/usage/formatter) configuration for Encure projects.

## Install

```bash
bun add -d @encure/lint-format oxlint oxfmt oxlint-tsgolint
```

`oxlint-tsgolint` is only needed for type-aware linting (the default; see `typeAware` below).

## Use

```ts
// oxlint.config.ts
import { lint } from "@encure/lint-format/lint";

export default lint({ nextjs: true });
```

```ts
// oxfmt.config.ts
import { format } from "@encure/lint-format/format";

export default format({
	sortTailwindcss: { stylesheet: "./src/globals.css" },
});
```

There is no root export: `lint` comes from `/lint` and `format` from `/format`, and neither entry loads the other tool, so a project can install only `oxlint` or only `oxfmt`.

```json
{
	"scripts": {
		"lint": "oxlint --type-aware --type-check .",
		"format": "oxfmt .",
		"format:check": "oxfmt --check ."
	}
}
```

## Options

`lint(options?, ...overrides)`

| Option      | Default | Effect                                                                    |
| ----------- | ------- | ------------------------------------------------------------------------- |
| `react`     | `true`  | Adds the `react` and `jsx-a11y` plugins with their rules.                 |
| `nextjs`    | `false` | Adds the `nextjs` plugin with its rules.                                  |
| `typeAware` | `true`  | Enables type-aware rules and type checking. Requires `oxlint-tsgolint`.   |
| `shadcn`    | `false` | Enables the rules from `@shadcn/lint`. See [shadcn rules](#shadcn-rules). |

Overrides are plain oxlint config objects. Rules merge by key, so you change one rule without redefining the rest, and arrays such as `plugins` and `ignorePatterns` concatenate:

```ts
export default lint(
	{ nextjs: true },
	{
		rules: { "no-console": "off" },
		ignorePatterns: ["packages/ui/src/components/**"],
	},
);
```

Because arrays concatenate, a top-level rule entry with options (`["error", { ... }]`) is appended to the preset's entry instead of replacing it when the preset already sets options for that rule. Change such a rule's options inside an `overrides` block; a plain severity (`"off"`, `"warn"`) at the top level is fine.

The preset sets `maxWarnings: 10`: more than 10 warnings fails the run, so `warn` rules still gate CI once they pile up.

`format(...overrides)` takes oxfmt config objects and merges them the same way. Pass `sortTailwindcss.stylesheet` yourself: it points at your project's theme, so it has no default.

## shadcn rules

`lint({ shadcn: true })` registers [`@shadcn/lint`](https://github.com/shadcn-ui/lint) and enables its six rules: `no-raw-colors` (with `scanAllStrings`) at `warn`, and at `error` `no-restyle` (layout classes only), `no-arbitrary-values` (layout allowed, with `scanAllStrings`), `no-inline-styles`, `no-unknown-classes` and `require-static-classes`. Each message names the component variant or theme token to use instead, which is what lets coding agents fix a violation in one pass.

```bash
bun add -d @shadcn/lint
```

Requirements and caveats:

- oxlint 1.80 or newer. Oxlint's JS plugin API is alpha, so a newer oxlint can break the plugin; pin both.
- Tailwind v4. Components and theme are discovered from your `components.json` (or `settings.shadcn`), so nothing about your design system lives in this package.
- The rules apply to every file oxlint lints. Scope them to your UI code with `overrides`, and turn off `no-restyle`, `no-arbitrary-values` and `require-static-classes` inside the directory that defines your components (or ignore it), because components style themselves:

```ts
export default lint(
	{ shadcn: true },
	{
		overrides: [
			{
				files: ["packages/email/**", "**/*.test.ts"],
				rules: {
					"shadcn/no-raw-colors": "off",
					"shadcn/no-arbitrary-values": "off",
					"shadcn/no-inline-styles": "off",
					"shadcn/no-unknown-classes": "off",
				},
			},
		],
		settings: { shadcn: { note: "See DESIGN.md for design rules." } },
	},
);
```

Per-component policy (`contracts`), custom messages and `settings.shadcn.note` belong in the consuming repo. See the [@shadcn/lint docs](https://github.com/shadcn-ui/lint/blob/main/docs/rules.md).

## Releasing

Releases are automated with [release-please](https://github.com/googleapis/release-please) and published with Bun.

1. Merge pull requests into `main` with a [Conventional Commits](https://www.conventionalcommits.org) title (`fix:`, `feat:`, `feat!:`). Squash merges keep one commit per PR.
2. On each push to `main`, release-please opens or updates a release PR that bumps `package.json` and `.release-please-manifest.json` and writes `CHANGELOG.md`. Before 1.0, `feat:` and breaking changes bump the minor version and `fix:` bumps the patch.
3. Merging the release PR tags `v<version>`, creates the GitHub release, and publishes: the workflow checks the tag against `package.json`, builds, runs `verify`, and runs `bun publish --access public`.

To publish an existing tag again, run the Release workflow by hand with that tag.

Repository setup:

- `NPM_TOKEN`: an npm token with publish rights on the `@encure` scope.
- Settings → Actions → General → "Allow GitHub Actions to create and approve pull requests" must be on.
- No other token is needed. A release PR opened with `GITHUB_TOKEN` starts no `pull_request` runs, so the Release workflow dispatches CI on the release branch itself; that run reports the `check` status the release PR needs when status checks are required on `main`.

See [CONTRIBUTING.md](CONTRIBUTING.md) to work on this package.
