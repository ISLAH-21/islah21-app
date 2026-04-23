import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<main className="container mx-auto px-4 py-8">
			<Skeleton className="mb-2 h-9 w-64" />
			<Skeleton className="mb-8 h-5 w-96" />
			<div className="space-y-4">
				<Skeleton className="h-32 w-full" />
				<Skeleton className="h-96 w-full" />
			</div>
		</main>
	);
}
