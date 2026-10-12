import { lint } from "./src/index.ts";

export default lint({ react: false }, { ignorePatterns: ["**/test/fixtures/**"] });
