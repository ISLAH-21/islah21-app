"use client";

import { Input } from "@base-ui-components/react/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { MynauiSearch } from "./icons/MynauiSearch";

interface AlumniSearchBarProps {
  placeholder: string;
}

export default function AlumniSearchBar({ placeholder }: AlumniSearchBarProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [searchTerm, setSearchTerm] = useState(
    () => searchParams.get("query") || "",
  );

  useEffect(() => {
    const queryParam = searchParams.get("query") || "";
    if (queryParam !== searchTerm) {
      setSearchTerm(queryParam);
    }
  }, [searchParams, searchTerm]);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="relative flex flex-1 shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <MynauiSearch className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 text-slate-500" />
      <Input
        placeholder={placeholder}
        className="peer block w-full rounded-md border border-slate-200 py-2 pl-9 text-sm caret-slate-600 placeholder:text-slate-500 focus-visible:outline-[1.5px] focus-visible:outline-slate-600"
        value={searchTerm}
        onChange={(e) => {
          const newValue = e.target.value;
          setSearchTerm(newValue);
          handleSearch(newValue);
        }}
      />
    </div>
  );
}
