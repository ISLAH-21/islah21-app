"use client";

import { useMobile } from "@/hooks/use-mobile";
import type { AlumniProps } from "@/lib/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AlumniSearchBar from "./alumniSearchBar";
import AlumniTable from "./alumniTable";
import PreviousPageIcon from "./icons/mynaui:chevron-left.svg";
import NextPageIcon from "./icons/mynaui:chevron-right.svg";

async function fetchAllAlumni(): Promise<AlumniProps[]> {
  const res = await fetch(`/api/alumni`);
  if (!res.ok) throw new Error("Failed to fetch alumni");
  return res.json();
}

export default function AlumniSection() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const isMobile = useMobile();

  const query = searchParams.get("search_query") || "";
  const page = Number(searchParams.get("page") || "1");
  const count = isMobile ? 6 : 12;

  const {
    data: allAlumni,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["alumni", page, query],
    queryFn: fetchAllAlumni,
    placeholderData: keepPreviousData,
  });

  if (!allAlumni) return null;

  const normalizedQuery = query.toLowerCase().trim();
  let filteredAlumni = allAlumni;

  if (normalizedQuery) {
    filteredAlumni = allAlumni.filter((alumni) => {
      alumni.name.toLowerCase().includes(normalizedQuery) ||
        alumni.job?.toLowerCase().includes(normalizedQuery) ||
        alumni.email?.toLowerCase().includes(normalizedQuery) ||
        alumni.residence?.toLowerCase().includes(normalizedQuery);
    });
  }

  const startIndex = (page - 1) * count;
  const endIndex = startIndex + count;
  const paginatedAlumni = filteredAlumni.slice(startIndex, endIndex);
  const hasMore = endIndex < filteredAlumni.length;
  const totalPages = Math.ceil(filteredAlumni.length / count);

  const processedData = {
    users: paginatedAlumni,
    currentPage: page,
    totalPages,
    hasMore,
    isFiltered: Boolean(normalizedQuery),
  };

  function goTo(newPage: number) {
    const params = new URLSearchParams(searchParams);
    if (newPage > 1) params.set("page", String(newPage));
    else params.delete("page");
    replace(`${pathname}?${params.toString()}`);
  }

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
        <AlumniTable alumni={processedData.users} />
      </div>
      <div className="flex w-full items-center justify-center gap-2 py-4 text-sm">
        <button
          onClick={() => goTo(page - 1)}
          disabled={page === 1 || isFetching}
          className="rounded-[3px] p-1 ring ring-slate-300 hover:cursor-pointer"
          type="button"
        >
          <PreviousPageIcon className="size-5 text-slate-500" />
        </button>
        <span className="px-2">
          Page {page} of {processedData.totalPages || 1}
        </span>
        <button
          onClick={() => goTo(page + 1)}
          disabled={!processedData.hasMore || isFetching}
          className="rounded-[3px] p-1 ring ring-slate-300 hover:cursor-pointer"
          type="button"
        >
          <NextPageIcon className="size-5 text-slate-500" />
        </button>
      </div>
    </section>
  );
}
