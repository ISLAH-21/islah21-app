import { toCamelCase } from "@/lib/string";
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

		rowData.links = links;

		return sheetSchema.parse(rowData);
	});
}

export const getAlumniSchemaParams = z.object({
	page: z.coerce // coerce attempts to convert the type (e.g., string from URL to number)
		.number()
		.int("Page must be an integer")
		.min(1, "Page must be at least 1")
		.optional()
		.default(1), // Default page is 1 if not provided
	pageSize: z.coerce
		.number()
		.int("PageSize must be an integer")
		.min(1, "PageSize must be at least 1")
		.max(100, "PageSize cannot exceed 100") // Add a reasonable max limit
		.optional()
		.default(10), // Default page size is 10
	name: z.string().optional().default(""),
	skills: z.string().optional().default(""),
	location: z.string().optional().default(""),
	company: z.string().optional().default(""),
});
