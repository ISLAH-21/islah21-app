import { ZodError } from "zod";

const commonHeaders = {
	"Content-Type": "application/json",
};

export function createSuccessResponse<T>(data: T, status?: 200): Response {
	return new Response(JSON.stringify(data), { status, headers: commonHeaders });
}

export function createErrorResponse<T extends { error: string }>(
	error: T,
	status: number,
): Response {
	return new Response(JSON.stringify(error), {
		status,
		headers: commonHeaders,
	});
}

export function handleErrorResponse(
	error: unknown,
	context = "processing request",
): Response {
	if (error instanceof ZodError) {
		const validationErrors = error.errors
			.map((e) => `${e.path.join(".")}: ${e.message}`)
			.join(", ");
		console.warn(`Validation Error: ${validationErrors}`);
		return createErrorResponse(
			{ error: `Invalid request parameters: ${validationErrors}` },
			400,
		);
	}

	let errorMessage = "An unexpected internal server error occurred.";
	if (error instanceof Error) {
		errorMessage = error.message;
	} else if (typeof error === "string") {
		errorMessage = error;
	}

	console.error(`Error during ${context}:`, error);

	return createErrorResponse({ error: errorMessage }, 500);
}
