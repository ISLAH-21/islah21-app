import { sheets } from "@googleapis/sheets";
import { auth } from "./google-auth";

export const sheet = sheets({ version: "v4", auth });
