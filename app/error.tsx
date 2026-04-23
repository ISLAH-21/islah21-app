"use client";

import { Button } from "@/components/ui/button";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<main className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-8 text-center">
			<h1 className="mb-2 font-bold text-3xl">Something went wrong</h1>
			<p className="mb-6 max-w-md text-muted-foreground">{error.message}</p>
			<Button onClick={reset}>Try again</Button>
		</main>
	);
}
