import { lint } from "./src/lint.ts";

export default lint({ react: false }, { ignorePatterns: ["**/test/fixtures/**"] });
