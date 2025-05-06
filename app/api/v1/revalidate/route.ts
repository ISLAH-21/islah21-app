import type { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { ENV } from "@/lib/env";
import { CACHE_KEYS } from "@/lib/constants";

export async function GET(request: NextRequest) {
	const tag = request.nextUrl.searchParams.get("tag");
	const id = request.nextUrl.searchParams.get("id");

	if (!tag || !!CACHE_KEYS.includes(tag) || !id || id !== ENV.REVALIDATE_ID) {
		return Response.json({ revalidated: false }, { status: 400 });
	}

	revalidateTag(tag);
	return Response.json({ revalidated: true, now: Date.now() });
}
