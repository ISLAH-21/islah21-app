import { ENV } from "@/lib/env";
import { sheet } from "@/lib/google-sheet";
import { parseSheetData } from "./alumni-schema";

export const getAlumni = async () => {
	const response = await sheet.spreadsheets.values.get({
		spreadsheetId: ENV.GOOGLE_SPREADSHEET_ID,
		range: `${ENV.GOOGLE_SPREADSHEET_SHEET_NAME}!A1:P`,
	});
	const rawValues = response.data.values;

	if (!rawValues || rawValues.length === 0) {
		return [];
	}

	return parseSheetData(rawValues);
};
