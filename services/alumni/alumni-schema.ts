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

export type Alumni = z.infer<typeof alumniSheetSchema>;

export type AlumniMetadata = {
	domiciles: string[];
	companies: string[];
	skills: string[];
};

export type ParsedAlumni = {
	data: Alumni[];
	metadata: AlumniMetadata;
};

function extractAlumniMetadata(alumniList: Alumni[]): AlumniMetadata {
	const domiciles = new Set<string>();
	const companies = new Set<string>();
	const skills = new Set<string>();

	for (const alumnus of alumniList) {
		if (alumnus.domicile) domiciles.add(alumnus.domicile);
		if (alumnus.company) companies.add(alumnus.company);
		for (const skill of alumnus.skills) {
			if (skill) skills.add(skill);
		}
	}

	return {
		domiciles: Array.from(domiciles).sort(),
		companies: Array.from(companies).sort(),
		skills: Array.from(skills).sort(),
	};
}

function normalizeAndValidateUrl(input: string) {
	try {
		const hasProtocol = /^https?:\/\//i.test(input);
		const url = new URL(hasProtocol ? input : `https://${input}`);

		if (
			!url.hostname.includes(".") ||
			/^(localhost|127\.|0\.0\.0\.0)/.test(url.hostname)
		) {
			return null;
		}

		return url.href;
	} catch {
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

export function parseSheetData(data: string[][]): ParsedAlumni {
	const [headers, ...rows] = data;

	const alumni = rows.map((row) => {
		// biome-ignore lint/suspicious/noExplicitAny: dynamic sheet row shape, validated by Zod below
		const rowData: Record<string, any> = {};
		const links: Array<{ type: Link; value: string | string[] }> = [];

		headers.forEach((header, index) => {
			const key = toCamelCase(header);
			const value = row[index] || "";

			if (key === "skills") {
				rowData[key] = value
					.split(",")
					.map((item) => item.trim())
					.filter(Boolean);
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

	return {
		data: alumni,
		metadata: extractAlumniMetadata(alumni),
	};
}

export const getAlumniSchemaParams = z.object({
	page: z.coerce
		.number()
		.int("Page must be an integer")
		.min(1, "Page must be at least 1")
		.optional()
		.default(1),
	pageSize: z.coerce
		.number()
		.int("PageSize must be an integer")
		.min(1, "PageSize must be at least 1")
		.max(100, "PageSize cannot exceed 100")
		.optional()
		.default(10),
	name: z.string().optional().default(""),
	skills: z.string().optional().default(""),
	location: z.string().optional().default(""),
	company: z.string().optional().default(""),
});

export type GetAlumniSchemaParams = z.infer<typeof getAlumniSchemaParams>;
