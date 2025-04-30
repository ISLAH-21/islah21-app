import { sheets } from "@googleapis/sheets";
import { auth } from "@/lib/google-auth";
import { ENV } from "@/lib/env";
import { parseSheetData } from "@/lib/schema";
import { z, ZodError } from "zod";

const getAlumniSchemaParams = z.object({
	page: z.coerce
		.number()
		.min(1, "Page must be at least 1")
		.optional()
		.default(1),
	pageSize: z.coerce
		.number()
		.min(1, "PageSize must be at least 1")
		.optional()
		.default(10),
	name: z.string().optional().default(""),
	skills: z.string().optional().default(""),
	location: z.string().optional().default(""),
	company: z.string().optional().default(""),
});

export async function GET(request: Request) {
	try {
		const url = new URL(request.url);
		const { page, pageSize, ...filters } = getAlumniSchemaParams.parse(
			Object.fromEntries(url.searchParams),
		);

		const sheet = sheets({ version: "v4", auth });
		const response = await sheet.spreadsheets.values.get({
			spreadsheetId: ENV.GOOGLE_SPREADSHEET_ID,
			range: `${ENV.GOOGLE_SPREADSHEET_SHEET_NAME}!A1:P`,
		});
		const data = response.data.values;
		const records = data ? parseSheetData(data) : [];

		const filteredRecords = records.filter((record) => {
			return (
				record.name.toLowerCase().includes(filters?.name?.toLowerCase()) &&
				record.skills.some((skill) =>
					skill.toLowerCase().includes(filters?.skills?.toLowerCase()),
				) &&
				record.address
					.toLowerCase()
					.includes(filters?.location?.toLowerCase()) &&
				record.company.toLowerCase().includes(filters?.company?.toLowerCase())
			);
		});

		const paginatedRecords = filteredRecords.slice(
			(page - 1) * pageSize,
			page * pageSize,
		);

		return new Response(JSON.stringify({ data: paginatedRecords }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		if (error instanceof ZodError) {
			return new Response(JSON.stringify({ error: error.message }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		return new Response(
			JSON.stringify({
				error: (error as Error)?.message ?? "Internal Server Error",
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
}

export async function POST(request: Request) {
	// Parse the request body
	const body = await request.json();
	const { name } = body;

	// e.g. Insert new user into your DB
	const newUser = { id: Date.now(), name };

	return new Response(JSON.stringify(newUser), {
		status: 201,
		headers: { "Content-Type": "application/json" },
	});
}
