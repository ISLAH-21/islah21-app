export function toCamelCase(str: string) {
	return str
		.toLowerCase()
		.replace(/[^a-zA-Z0-9 ]/g, "")
		.replace(/ (.)/g, (_, c) => c.toUpperCase());
}
