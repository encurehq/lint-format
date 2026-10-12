import { describe, expect, test } from "bun:test";

import { config } from "../src/index.ts";
import { formatConfig } from "../src/oxfmt.ts";

describe("config", () => {
	test("react and nextjs presets add their plugins and rules", () => {
		const result = config({ react: true, nextjs: true });

		expect(result.plugins).toContain("react");
		expect(result.plugins).toContain("jsx-a11y");
		expect(result.plugins).toContain("nextjs");
		expect(result.rules?.["react/rules-of-hooks"]).toBe("error");
	});

	test("react: false drops react, a11y and next rules", () => {
		const result = config({ react: false });

		expect(result.plugins).not.toContain("react");
		expect(Object.keys(result.rules ?? {}).some((name) => name.startsWith("react/"))).toBe(false);
	});

	test("overrides merge rules by key and concatenate arrays", () => {
		const result = config({}, { rules: { "no-console": "off" }, ignorePatterns: ["**/gen/**"] });

		expect(result.rules?.["no-console"]).toBe("off");
		expect(result.rules?.["no-var"]).toBe("error");
		expect(result.ignorePatterns).toContain("**/gen/**");
		expect(result.ignorePatterns).toContain("**/node_modules/**");
	});

	test("typeAware: false disables type checking", () => {
		expect(config({ typeAware: false }).options).toMatchObject({
			typeAware: false,
			typeCheck: false,
		});
	});
});

describe("formatConfig", () => {
	test("keeps tailwind sorting functions and merges a stylesheet override", () => {
		const result = formatConfig({ sortTailwindcss: { stylesheet: "./globals.css" } });

		expect(result.sortTailwindcss).toMatchObject({
			functions: ["cn", "clsx", "cva", "tw"],
			stylesheet: "./globals.css",
		});
	});
});
