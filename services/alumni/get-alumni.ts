import { ENV } from "@/lib/env";
import { sheet } from "@/lib/google-sheet";
import { type ParsedAlumni, parseSheetData } from "./alumni-schema";

const EMPTY_RESULT: ParsedAlumni = {
	data: [],
	metadata: { domiciles: [], companies: [], skills: [] },
};

export const getAlumni = async (): Promise<ParsedAlumni> => {
	try {
		const response = await sheet.spreadsheets.values.get({
			spreadsheetId: ENV.GOOGLE_SPREADSHEET_ID,
			range: `${ENV.GOOGLE_SPREADSHEET_SHEET_NAME}!A:P`,
			fields: "values",
		});
		const rawValues = response.data.values;

		if (!rawValues || rawValues.length === 0) {
			return EMPTY_RESULT;
		}

		return parseSheetData(rawValues);
	} catch (error) {
		console.error("[getAlumni] Failed to fetch from Google Sheets:", error);
		throw new Error("Failed to load alumni data. Please try again later.");
	}
};
