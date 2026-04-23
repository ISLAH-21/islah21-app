import { AlumniDirectory } from "@/components/alumni-directory";
import { CACHE_KEY } from "@/lib/constants";
import {
	type GetAlumniSchemaParams,
	getAlumniSchemaParams,
} from "@/services/alumni/alumni-schema";
import { getAlumni } from "@/services/alumni/get-alumni";
import { unstable_cache } from "next/cache";

const getAlumniCached = unstable_cache(getAlumni, [CACHE_KEY.alumniList], {
	revalidate: 3600,
	tags: [CACHE_KEY.alumniList],
});

function matchesFilters(
	alumnus: { name: string; domicile: string; company: string; skills: string[] },
	filters: Pick<
		GetAlumniSchemaParams,
		"name" | "skills" | "location" | "company"
	>,
) {
	if (
		filters.name &&
		!alumnus.name.toLowerCase().includes(filters.name.toLowerCase())
	) {
		return false;
	}
	if (
		filters.skills &&
		!alumnus.skills.some(
			(skill) => skill.toLowerCase() === filters.skills.toLowerCase(),
		)
	) {
		return false;
	}
	if (
		filters.location &&
		alumnus.domicile.toLowerCase() !== filters.location.toLowerCase()
	) {
		return false;
	}
	if (
		filters.company &&
		alumnus.company.toLowerCase() !== filters.company.toLowerCase()
	) {
		return false;
	}
	return true;
}

export default async function Home({
	searchParams,
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
	const raw = await searchParams;
	const safeParams = getAlumniSchemaParams.safeParse(raw);

	if (!safeParams.success) {
		console.error(
			"[page.tsx] Invalid query params:",
			safeParams.error.flatten(),
		);
	}

	const params = safeParams.success
		? safeParams.data
		: getAlumniSchemaParams.parse({});

	const { data: allAlumni, metadata } = await getAlumniCached();

	const filtered = allAlumni.filter((alumnus) =>
		matchesFilters(alumnus, params),
	);

	const totalCount = filtered.length;
	const totalPages = Math.max(1, Math.ceil(totalCount / params.pageSize));
	const page = Math.min(params.page, totalPages);
	const start = (page - 1) * params.pageSize;
	const items = filtered.slice(start, start + params.pageSize);

	return (
		<main className="container mx-auto px-4 py-8">
			<h1 className="mb-2 font-bold text-3xl">Alumni Directory</h1>
			<p className="mb-8 text-muted-foreground">
				Search and filter our school alumni network
			</p>
			<AlumniDirectory
				items={items}
				totalCount={totalCount}
				page={page}
				pageSize={params.pageSize}
				filters={{
					name: params.name,
					skills: params.skills,
					location: params.location,
					company: params.company,
				}}
				metadata={metadata}
			/>
		</main>
	);
}
