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
import { lint } from "@encure/lint-format";

export default lint({ nextjs: true });
```

```ts
// oxfmt.config.ts
import { format } from "@encure/lint-format";

export default format({
	sortTailwindcss: { stylesheet: "./src/globals.css" },
});
```

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

| Option      | Default | Effect                                                                  |
| ----------- | ------- | ----------------------------------------------------------------------- |
| `react`     | `true`  | Adds the `react` and `jsx-a11y` plugins with their rules.               |
| `nextjs`    | `false` | Adds the `nextjs` plugin with its rules.                                |
| `typeAware` | `true`  | Enables type-aware rules and type checking. Requires `oxlint-tsgolint`. |

Overrides are plain oxlint config objects. Rules merge by key, so you change one rule without redefining the rest, and `plugins` and `ignorePatterns` concatenate:

```ts
export default lint(
	{ nextjs: true },
	{
		rules: { "no-console": "off" },
		ignorePatterns: ["packages/ui/src/components/**"],
	},
);
```

`format(...overrides)` takes oxfmt config objects and merges them the same way. Pass `sortTailwindcss.stylesheet` yourself: it points at your project's theme, so it has no default.

## Organization rules

The preset enforces Encure conventions, not only generic style. For example, `react/forbid-elements` flags `<Dialog>`, `<Popover>` and `<Sheet>` in favor of `<ResponsiveDialog>`, `<ResponsivePopover>` and `<ResponsiveSheet>`, and `unicorn/filename-case` requires kebab-case file names.

## Releasing

Releases are cut from tags and published with Bun.

1. `bun pm version <patch|minor|major>` bumps `package.json` and creates the `v*` tag.
2. `git push --follow-tags` runs the release workflow, which checks the tag against `package.json`, builds, checks, and runs `bun publish --access public`.

The workflow needs an npm token with publish rights on the `@encure` scope, stored as the repository secret `NPM_TOKEN`.

## Development

Requires Bun 1.4.3 or newer: type checking runs through the built-in `bun check`. The aggregate script is `verify`, not `check`, because a `check` script in `package.json` would shadow the built-in command.

```bash
bun install
bun run build
bun run verify   # lint, format check, `bun check` (types), test
```

The repo lints and formats itself with its own presets.
