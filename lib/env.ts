import { z } from "zod";

const envSchema = z.object({
	GOOGLE_CLIENT_EMAIL: z.string(),
	GOOGLE_PRIVATE_KEY: z.string(),
	GOOGLE_SPREADSHEET_ID: z.string(),
	GOOGLE_SPREADSHEET_SCOPE: z
		.string()
		.transform((val) => val.split(",").map((s) => s.trim())),
	GOOGLE_SPREADSHEET_SHEET_NAME: z.string(),
	REVALIDATE_ID: z.string(),
});

export const ENV = envSchema.parse(process.env);
