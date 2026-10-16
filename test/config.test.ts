import { describe, expect, test } from "bun:test";

import { format, lint } from "../src/index.ts";
import { resolveDesignSystemPlugin } from "../src/rules/design-system.ts";

function failToResolve(): never {
	throw new Error("Cannot find package");
}

describe("lint", () => {
	test("react and nextjs presets add their plugins and rules", () => {
		const result = lint({ react: true, nextjs: true });

		expect(result.plugins).toContain("react");
		expect(result.plugins).toContain("jsx-a11y");
		expect(result.plugins).toContain("nextjs");
		expect(result.rules?.["react/rules-of-hooks"]).toBe("error");
	});

	test("react: false drops react, a11y and next rules", () => {
		const result = lint({ react: false });

		expect(result.plugins).not.toContain("react");
		expect(Object.keys(result.rules ?? {}).some((name) => name.startsWith("react/"))).toBe(false);
	});

	test("overrides merge rules by key and concatenate arrays", () => {
		const result = lint({}, { rules: { "no-console": "off" }, ignorePatterns: ["**/gen/**"] });

		expect(result.rules?.["no-console"]).toBe("off");
		expect(result.rules?.["no-var"]).toBe("error");
		expect(result.ignorePatterns).toContain("**/gen/**");
		expect(result.ignorePatterns).toContain("**/node_modules/**");
	});

	test("typeAware: false disables type checking", () => {
		expect(lint({ typeAware: false }).options).toMatchObject({
			typeAware: false,
			typeCheck: false,
		});
	});
});

describe("lint designSystem", () => {
	test("is off by default: no JS plugin and no shadcn rules", () => {
		const result = lint({});

		expect(result.jsPlugins).toBeUndefined();
		expect(Object.keys(result.rules ?? {}).some((name) => name.startsWith("shadcn/"))).toBe(false);
	});

	test("registers the resolved @shadcn/lint path and enables all six rules", () => {
		const result = lint({ designSystem: true });

		expect(result.jsPlugins).toEqual([
			expect.stringMatching(/@shadcn[\\/]lint[\\/]dist[\\/]index\.js$/),
		]);
		expect(result.rules?.["shadcn/no-raw-colors"]).toEqual(["warn", { scanAllStrings: true }]);
		expect(result.rules?.["shadcn/no-restyle"]).toEqual(["error", { allow: ["layout"] }]);
		expect(
			Object.keys(result.rules ?? {}).filter((name) => name.startsWith("shadcn/")),
		).toHaveLength(6);
	});

	test("overrides turn a design-system rule off and add their own plugin", () => {
		const result = lint(
			{ designSystem: true },
			{ jsPlugins: ["./local-plugin.js"], rules: { "shadcn/no-restyle": "off" } },
		);

		expect(result.rules?.["shadcn/no-restyle"]).toBe("off");
		expect(result.rules?.["shadcn/no-inline-styles"]).toBe("error");
		expect(result.jsPlugins).toHaveLength(2);
		expect(result.jsPlugins).toContain("./local-plugin.js");
	});

	test("a missing @shadcn/lint fails with an install hint", () => {
		expect(() => resolveDesignSystemPlugin(failToResolve)).toThrow("bun add -d @shadcn/lint");
	});
});

describe("format", () => {
	test("keeps tailwind sorting functions and merges a stylesheet override", () => {
		const result = format({ sortTailwindcss: { stylesheet: "./globals.css" } });

		expect(result.sortTailwindcss).toMatchObject({
			functions: ["cn", "clsx", "cva", "tw"],
			stylesheet: "./globals.css",
		});
	});
});
