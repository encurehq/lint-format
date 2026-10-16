import { fileURLToPath } from "node:url";

import type { OxlintConfig } from "oxlint";

/** Rules from `@shadcn/lint`: Tailwind classes and component styling checked against the project's own theme and components. */
export const shadcnRules = {
	"shadcn/no-unknown-classes": "error",
	"shadcn/require-static-classes": "error",
	"shadcn/no-arbitrary-values": ["error", { allow: ["layout"], scanAllStrings: true }],
	"shadcn/no-raw-colors": ["warn", { scanAllStrings: true }],
	"shadcn/no-inline-styles": "error",
	"shadcn/no-restyle": ["error", { allow: ["layout"] }],
} satisfies NonNullable<OxlintConfig["rules"]>;

/** Resolves `@shadcn/lint` from the consuming project, where the optional peer dependency is installed. */
export function resolveShadcnPlugin(
	resolve: (specifier: string) => string = (specifier) => import.meta.resolve(specifier),
): string {
	try {
		return fileURLToPath(resolve("@shadcn/lint"));
	} catch (error) {
		throw new Error(
			"lint({ shadcn: true }) needs @shadcn/lint. Install it: bun add -d @shadcn/lint",
			{
				cause: error,
			},
		);
	}
}
