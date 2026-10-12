import type { OxlintConfig } from "oxlint";

/** React and hooks rules, including the organization's responsive overlay components. */
export const reactRules = {
	"react/exhaustive-deps": "warn",
	"react/forbid-elements": [
		"warn",
		{
			forbid: [
				{
					element: "Dialog",
					message: "use <ResponsiveDialog> instead",
				},
				{
					element: "Popover",
					message: "use <ResponsivePopover> instead",
				},
				{
					element: "Sheet",
					message: "use <ResponsiveSheet> instead",
				},
			],
		},
	],
	"react/hook-use-state": "warn",
	"react/rules-of-hooks": "error",
	"react/self-closing-comp": "warn",
	"react/jsx-boolean-value": "off",
	"react/jsx-curly-brace-presence": [
		"error",
		{
			props: "ignore",
			children: "ignore",
			propElementValues: "always",
		},
	],
	"react/jsx-key": [
		"warn",
		{
			checkFragmentShorthand: false,
			warnOnDuplicates: true,
		},
	],
	"react/jsx-max-depth": [
		"error",
		{
			max: 10,
		},
	],
	"react/jsx-no-duplicate-props": "error",
	"react/jsx-no-script-url": "error",
	"react/jsx-no-target-blank": "error",
	"react/jsx-no-useless-fragment": "off",
	"react/jsx-no-constructed-context-values": "off",
	"react/jsx-pascal-case": [
		"error",
		{
			allowNamespace: true,
		},
	],
	"react/react-in-jsx-scope": "off",
	"react/button-has-type": "warn",
	"react/no-unknown-property": "error",
	"react/no-array-index-key": "off",
} satisfies NonNullable<OxlintConfig["rules"]>;
