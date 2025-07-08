import { JWT } from "google-auth-library";
import { ENV } from "./env";

export const auth = new JWT({
  email: ENV.GOOGLE_CLIENT_EMAIL,
  key: ENV.GOOGLE_PRIVATE_KEY,
  scopes: ENV.GOOGLE_SPREADSHEET_SCOPE,
});
