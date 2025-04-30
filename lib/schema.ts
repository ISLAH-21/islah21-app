import { z } from "zod";

const LINKS = [
	"instagram",
	"twitter",
	"github",
	"behance",
	"youtube",
	"website",
	"others",
] as const;

type Link = (typeof LINKS)[number];

const sheetSchema = z.object({
	timestamp: z.string(),
	name: z.string(),
	email: z.string(),
	address: z.string(),
	phoneNumber: z.string(),
	dateOfBirth: z.string(),
	currentJob: z.string(),
	company: z.string(),
	skills: z.array(z.string()),
	links: z.array(
		z.object({
			type: z.string(),
			value: z.union([z.string(), z.array(z.string())]),
		}),
	),
});

export function parseSheetData(data: string[][]) {
	const [headers, ...rows] = data;

	return rows.map((row) => {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const rowData: Record<string, any> = {};
		const links: Array<{ type: Link; value: string | string[] }> = [];

		headers.forEach((header, index) => {
			const key = toCamelCase(header);
			const value = row[index] || "";

			if (key === "skills") {
				rowData[key] = value.split(",").map((item) => item.trim());
			} else if (LINKS.includes(key as Link)) {
				links.push({ type: key as Link, value });
			} else {
				rowData[key] = value;
			}
		});

		// Group social media and others under "links"
		rowData.links = links;

		// Validate and parse the data using the Zod schema
		return sheetSchema.parse(rowData); // This will throw an error if invalid
	});
}

// Helper to convert headers to camelCase
function toCamelCase(str: string) {
	return str
		.toLowerCase()
		.replace(/[^a-zA-Z0-9 ]/g, "")
		.replace(/ (.)/g, (_, c) => c.toUpperCase());
}
