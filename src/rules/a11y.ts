import type { OxlintConfig } from "oxlint";

/** Accessibility rules for JSX. */
export const a11yRules = {
	"jsx-a11y/heading-has-content": "error",
	"jsx-a11y/alt-text": "warn",
	"jsx-a11y/anchor-is-valid": "error",
	"jsx-a11y/img-redundant-alt": "error",
	"jsx-a11y/no-noninteractive-tabindex": "error",
	"jsx-a11y/click-events-have-key-events": "off",
	"jsx-a11y/no-static-element-interactions": "warn",
	"jsx-a11y/prefer-tag-over-role": "error",
} satisfies NonNullable<OxlintConfig["rules"]>;
