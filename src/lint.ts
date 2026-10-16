import { mergeDeep } from "./merge.ts";
import { a11yRules } from "./rules/a11y.ts";
import { baseRules } from "./rules/base.ts";
import { nextjsRules } from "./rules/nextjs.ts";
import { reactRules } from "./rules/react.ts";
import { shadcnRules, resolveShadcnPlugin } from "./rules/shadcn.ts";

import type { OxlintConfig } from "oxlint";

export interface LintOptions {
	/** React, hooks and JSX accessibility rules. Defaults to `true`. */
	react?: boolean;
	/** Next.js rules. Defaults to `false`. */
	nextjs?: boolean;
	/** Type-aware rules and type checking; needs `oxlint-tsgolint` installed. Defaults to `true`. */
	typeAware?: boolean;
	/** Rules from `@shadcn/lint`; needs `@shadcn/lint` installed and oxlint 1.80 or newer. Defaults to `false`. */
	shadcn?: boolean;
}

const basePlugins = ["import", "eslint", "typescript", "unicorn", "oxc", "jsdoc"] as const;

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
 * Builds the Encure oxlint configuration.
 *
 * Overrides merge over the preset: rules merge by key, `plugins` and `ignorePatterns` concatenate.
 */
export function lint(options: LintOptions = {}, ...overrides: OxlintConfig[]): OxlintConfig {
	const { react = true, nextjs = false, typeAware = true, shadcn = false } = options;

	const plugins: string[] = [...basePlugins];
	let rules: NonNullable<OxlintConfig["rules"]> = { ...baseRules };

	if (react) {
		plugins.push("react", "jsx-a11y");
		rules = { ...rules, ...reactRules, ...a11yRules };
	}

	if (nextjs) {
		plugins.push("nextjs");
		rules = { ...rules, ...nextjsRules };
	}

	if (shadcn) {
		rules = { ...rules, ...shadcnRules };
	}

	const preset = {
		categories: {
			correctness: "error",
			perf: "warn",
			suspicious: "off",
		},
		options: {
			typeAware,
			typeCheck: typeAware,
			maxWarnings: 10,
			reportUnusedDisableDirectives: "warn",
		},
		plugins: plugins as NonNullable<OxlintConfig["plugins"]>,
		...(shadcn && { jsPlugins: [resolveShadcnPlugin()] }),
		rules,
		ignorePatterns: baseIgnorePatterns,
		env: {
			es2022: true,
			node: true,
			browser: true,
		},
	} satisfies OxlintConfig;

	return mergeDeep<OxlintConfig>(preset, ...overrides);
}

export { mergeDeep } from "./merge.ts";
