"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AlumniSearchBar from "./alumniSearchBar";
import AlumniTable from "./alumniTable";

async function fetchAlumni({ queryKey }: { queryKey: (string | number)[] }) {
  const [_key, page, search_query] = queryKey;
  const params = new URLSearchParams({
    count: "12",
    page: String(page),
  });

  if (search_query) params.set("search_query", String(search_query));

  const res = await fetch(`/api/alumni?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch alumni");
  return res.json();
}

export default function AlumniSection() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const query = searchParams.get("search_query") || "";

  const page = Number(searchParams.get("page") || "1");

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["alumni", page, query],
    queryFn: fetchAlumni,
    placeholderData: keepPreviousData,
  });

  function goTo(newPage: number) {
    const params = new URLSearchParams(searchParams);
    if (newPage > 1) params.set("page", String(newPage));
    else params.delete("page");
    replace(`${pathname}?${params.toString()}`);
  }

  function _clearSearch() {
    const params = new URLSearchParams(searchParams);
    params.delete("search_query");
    params.delete("page");
    replace(`${pathname}?${params.toString()}`);
  }

  const hasSearchQuery = Boolean(query.trim());

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <section
      id="directory-search"
      className="mx-auto flex h-full max-w-[1200px] flex-col items-start justify-center px-2 py-4 tracking-tight"
    >
      <div className="flex w-full max-w-[1200px] flex-col px-2">
        <div
          id="filter"
          className="flex size-full items-center justify-center gap-x-2 text-sm"
        >
          <div className="hidden rounded-md border border-slate-200 px-4 py-2 md:block">
            Filter
          </div>
          <AlumniSearchBar placeholder="Cari nama alumni" />
        </div>
        <AlumniTable alumni={data.users} />
      </div>
      <div className="flex w-full items-center justify-center gap-2 py-4 text-sm">
        <button
          onClick={() => goTo(page - 1)}
          disabled={page === 1 || isFetching}
          className="rounded-md px-3 py-1 ring ring-slate-300"
          type="button"
        >
          Prev
        </button>
        <span className="px-2">
          Page {page} of {data.totalPages || 1}
          {hasSearchQuery && ` (${data.totalResults} results)`}
        </span>
        <button
          onClick={() => goTo(page + 1)}
          disabled={!data.hasMore || isFetching}
          className="rounded-md px-3 py-1 ring ring-slate-300"
          type="button"
        >
          Next
        </button>
      </div>

      {/* {isFetching && <div className="text-sm">Updating...</div>} */}
    </section>
  );
}
