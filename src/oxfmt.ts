import { defineConfig, type OxfmtConfig } from "oxfmt";

import { mergeDeep } from "./merge.ts";

const baseIgnorePatterns = [
	"**/node_modules/**",
	"**/.next/**",
	"**/dist/**",
	"**/build/**",
	"**/.turbo/**",
	"**/coverage/**",
	"**/*.min.js",
	"**/*lock.json",
	"**/bun.lock",
];

/**
 * Builds the Encure oxfmt configuration.
 *
 * Tailwind class sorting is enabled for `cn`, `clsx`, `cva` and `tw`; pass `sortTailwindcss: { stylesheet }`
 * as an override so it resolves your project's theme.
 */
export function formatConfig(...overrides: OxfmtConfig[]): OxfmtConfig {
	const preset = defineConfig({
		printWidth: 100,
		tabWidth: 2,
		useTabs: true,
		semi: true,
		singleQuote: false,
		jsxSingleQuote: false,
		trailingComma: "all",
		bracketSpacing: true,
		bracketSameLine: false,
		arrowParens: "always",
		endOfLine: "lf",
		insertFinalNewline: true,
		quoteProps: "as-needed",
		sortPackageJson: true,
		sortImports: {
			groups: [
				"builtin",
				"external",
				["internal", "subpath"],
				["parent", "sibling", "index"],
				"style",
				"type",
				"unknown",
			],
			internalPattern: ["~/", "@/"],
			newlinesBetween: true,
			order: "asc",
			ignoreCase: true,
		},
		sortTailwindcss: {
			functions: ["cn", "clsx", "cva", "tw"],
		},
		ignorePatterns: baseIgnorePatterns,
	});

	return mergeDeep(preset, ...overrides);
}
