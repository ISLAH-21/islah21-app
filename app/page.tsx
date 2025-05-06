import { AlumniDirectory } from "@/components/alumni-directory";
import {
	type GetAlumniSchemaParams,
	getAlumniSchemaParams,
} from "@/services/alumni/alumni-schema";
import { getAlumni } from "@/services/alumni/get-alumni";
import { unstable_cache } from "next/cache";

const getAlumniList = async ({ params }: { params: GetAlumniSchemaParams }) => {
	const safeParams = getAlumniSchemaParams.safeParse(params);

	if (safeParams.error) {
		return {
			data: [],
		};
	}

	const { page, pageSize, ...filters } = safeParams.data;

	const alumni = await getAlumni();
	const filteredAlumni = alumni.filter((record) => {
		return (
			record.name.toLowerCase().includes(filters?.name?.toLowerCase()) &&
			record.skills.some((skill) =>
				skill.toLowerCase().includes(filters?.skills?.toLowerCase()),
			) &&
			record.domicile
				.toLowerCase()
				.includes(filters?.location?.toLowerCase()) &&
			record.company.toLowerCase().includes(filters?.company?.toLowerCase())
		);
	});

	return {
		data: filteredAlumni,
	};
};

const getAlumniListCached = unstable_cache(getAlumniList, ["alumni-list"], {
	revalidate: 3600,
	tags: ["alumni-list"],
});

export default async function Home({
	params,
}: {
	params: Promise<GetAlumniSchemaParams>;
}) {
	const queryParams = await params;
	const { data: alumni } = await getAlumniListCached({ params: queryParams });

	return (
		<main className="container mx-auto px-4 py-8">
			<h1 className="mb-2 font-bold text-3xl">Alumni Directory</h1>
			<p className="mb-8 text-muted-foreground">
				Search and filter our school alumni network
			</p>
			<AlumniDirectory alumni={alumni} />
		</main>
	);
}
