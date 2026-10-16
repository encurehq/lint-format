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
