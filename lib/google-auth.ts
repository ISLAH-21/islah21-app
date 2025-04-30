import { ENV } from "@/lib/env";
import { JWT } from "google-auth-library";

export const auth = new JWT({
	email: ENV.GOOGLE_CLIENT_EMAIL,
	key: ENV.GOOGLE_PRIVATE_KEY,
	scopes: ENV.GOOGLE_SPREADSHEET_SCOPE,
});
