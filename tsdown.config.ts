import { defineConfig } from "tsdown";

export default defineConfig({
	entry: { lint: "src/lint.ts", format: "src/format.ts" },
	format: "esm",
	dts: true,
	clean: true,
	platform: "node",
});
