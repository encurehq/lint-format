type PlainObject = Record<string, unknown>;

function isPlainObject(value: unknown): value is PlainObject {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Merges objects key by key; arrays concatenate without duplicates, and later values win everywhere else. */
export function mergeDeep<T extends object>(base: T, ...overrides: object[]): T {
	const result: PlainObject = { ...(base as PlainObject) };

	for (const override of overrides) {
		for (const [key, value] of Object.entries(override)) {
			const current = result[key];

			if (Array.isArray(current) && Array.isArray(value)) {
				result[key] = [...new Set([...current, ...value])];
			} else if (isPlainObject(current) && isPlainObject(value)) {
				result[key] = mergeDeep(current, value);
			} else {
				result[key] = value;
			}
		}
	}

	return result as T;
}
