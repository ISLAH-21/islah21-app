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

const baseUrls: Record<Exclude<Link, "website" | "others">, string> = {
	instagram: "https://instagram.com/",
	twitter: "https://twitter.com/",
	github: "https://github.com/",
	behance: "https://behance.net/",
	youtube: "https://youtube.com/",
};

const EXCLUDED_FIELD = ["phoneNumber", "timestamp", "dateOfBirth", "address"];

type Link = (typeof LINKS)[number];

const alumniSheetSchema = z.object({
	name: z.string(),
	email: z.string(),
	domicile: z.string(),
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

export function extractAlumniInfo(alumniList: Alumni[]) {
	const domiciles: Set<string> = new Set();
	const companies: Set<string> = new Set();
	const allSkills: Set<string> = new Set();

	for (const alumnus of alumniList) {
		if (alumnus.domicile) {
			domiciles.add(alumnus.domicile);
		}
		if (alumnus.company) {
			companies.add(alumnus.company);
		}
		for (const skill of alumnus.skills) {
			if (skill) {
				allSkills.add(skill);
			}
		}
	}

	return {
		domiciles: Array.from(domiciles),
		companies: Array.from(companies),
		skills: Array.from(allSkills),
	};
}

export type Alumni = z.infer<typeof alumniSheetSchema>;

function normalizeAndValidateUrl(input: string) {
	try {
		const hasProtocol = /^https?:\/\//i.test(input);
		const url = new URL(hasProtocol ? input : `https://${input}`);

		// Optional: reject IPs, localhost, or non-TLDs
		if (
			!url.hostname.includes(".") ||
			/^(localhost|127\.|0\.0\.0\.0)/.test(url.hostname)
		) {
			return null;
		}

		return url.href;
	} catch (error) {
		return null;
	}
}

function parseLink(type: Link, value: string): string | string[] {
	if (value.startsWith("https://")) return value;

	if (value.startsWith("@")) {
		const handle = value.slice(1);
		if (type in baseUrls) {
			return baseUrls[type as keyof typeof baseUrls] + handle;
		}
	}

	return value;
}

export function parseSheetData(data: string[][]): Alumni[] {
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
			} else if (LINKS.includes(key as Link) && value !== "") {
				const type = key as Link;

				if (type === "others") {
					const rawOtherLinks = value
						.split(",")
						.filter(Boolean)
						.map((url) => url.trim());
					const otherLinks = rawOtherLinks
						.map(normalizeAndValidateUrl)
						.filter(Boolean) as string[];
					if (otherLinks.length > 0) {
						links.push({ type, value: otherLinks });
					}
				} else if (type === "website") {
					const webLink = normalizeAndValidateUrl(value);
					if (webLink) {
						links.push({ type, value: webLink });
					}
				} else {
					links.push({ type, value: parseLink(type, value) });
				}
			} else if (!EXCLUDED_FIELD.includes(key)) {
				rowData[key] = value;
			}
		});

		rowData.links = links;

		return alumniSheetSchema.parse(rowData);
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

export type GetAlumniSchemaParams = z.infer<typeof getAlumniSchemaParams>;
