import type { NextRequest } from "next/server";
import { createSuccessResponse, handleErrorResponse } from "@/lib/response";
import { getAlumniSchemaParams } from "@/services/alumni/alumni-schema";
import { getAlumni } from "@/services/alumni/get-alumni";

export async function GET(request: NextRequest) {
	try {
		const { page, pageSize, ...filters } = getAlumniSchemaParams.parse(
			Object.fromEntries(request.nextUrl.searchParams),
		);

		const alumni = await getAlumni();
		const filteredAlumni = alumni.filter((record) => {
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

		const paginatedalumni = filteredAlumni.slice(
			(page - 1) * pageSize,
			page * pageSize,
		);

		return createSuccessResponse({ data: paginatedalumni });
	} catch (error) {
		return handleErrorResponse(error, "getAlumni");
	}
}
