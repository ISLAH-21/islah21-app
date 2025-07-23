"use client";

import { useMobile } from "@/hooks/use-mobile";
import type { AlumniProps } from "@/lib/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import AlumniPagination from "./alumni-pagination";
import AlumniSearch from "./alumni-search";
import { AlumniSectionSkeleton } from "./alumni-skeletons";
import AlumniTable from "./alumni-table";

async function fetchAllAlumni(): Promise<AlumniProps[]> {
  const res = await fetch(`/api/alumni`);
  if (!res.ok) throw new Error(`Failed to fetch alumni`);
  return res.json();
}

const ITEMS_PER_PAGE = {
  mobile: 6,
  desktop: 12,
} as const;

// 1 hour (ms)
const STALE_TIME = 60 * 60 * 1000;

export default function AlumniSection() {
  const searchParams = useSearchParams();

  const isMobile = useMobile();

  const query = searchParams.get("query") || "";
  const page = Number(searchParams.get("page") || "1");
  const count = isMobile ? ITEMS_PER_PAGE.mobile : ITEMS_PER_PAGE.desktop;

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
    staleTime: STALE_TIME,
  });

  if (isLoading || !allAlumni) return <AlumniSectionSkeleton items={count} />;
  if (isError) return <div>Error: {error.message}</div>;
  if (!allAlumni) return null;

  const normalizedQuery = query.toLowerCase().trim();
  let filteredAlumni = allAlumni;

  if (normalizedQuery) {
    filteredAlumni = allAlumni.filter((alumni) => {
      return (
        alumni.name.toLowerCase().includes(normalizedQuery) ||
        alumni.job?.toLowerCase().includes(normalizedQuery) ||
        alumni.email?.toLowerCase().includes(normalizedQuery) ||
        alumni.residence?.toLowerCase().includes(normalizedQuery)
      );
    });
  }

  const startIndex = (page - 1) * count;
  const endIndex = startIndex + count;
  const paginatedAlumni = filteredAlumni.slice(startIndex, endIndex);
  const hasMore = endIndex < filteredAlumni.length;
  const totalPages = Math.ceil(filteredAlumni.length / count);

  const isFiltered = Boolean(normalizedQuery);

  const _processedData = {
    users: paginatedAlumni,
    isFiltered,
  };

  const paginationData = {
    currentPage: page,
    totalPages,
    hasMore,
    isFetching,
  };

  return (
    <section
      id="directory-search"
      className="mx-auto flex h-full max-w-[1440px] flex-col items-start justify-center tracking-tight"
    >
      <div className="flex w-full flex-col px-4 pt-4">
        <AlumniSearch placeholder="Cari nama alumni" />
        <AlumniTable data={paginatedAlumni} />
        <AlumniPagination data={paginationData} />
      </div>
    </section>
  );
}
