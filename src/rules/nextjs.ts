import type { OxlintConfig } from "oxlint";

/** Next.js rules. */
export const nextjsRules = {
	"nextjs/no-async-client-component": "error",
	"nextjs/no-html-link-for-pages": "error",
	"nextjs/no-img-element": "warn",
} satisfies NonNullable<OxlintConfig["rules"]>;
