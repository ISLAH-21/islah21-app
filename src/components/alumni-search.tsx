"use client";

import { Input } from "@base-ui-components/react/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import SearchIcon from "./icons/mynaui:search.svg";
import ClearIcon from "./icons/mynaui:x.svg";

interface AlumniSearchProps {
  placeholder: string;
}

export default function AlumniSearch({ placeholder }: AlumniSearchProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [searchValue, setSearchValue] = useState(
    searchParams.get("query") || "",
  );

  useEffect(() => {
    setSearchValue(searchParams.get("query") || "");
  }, [searchParams]);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  function clearSearch() {
    const params = new URLSearchParams(searchParams);
    params.delete("query");
    params.delete("page");
    replace(`${pathname}?${params.toString()}`);
  }

  const hasQuery = !!searchParams.get("query")?.trim();

  return (
    <div
      id="filter"
      className="justify-baseline flex size-full items-center gap-x-2 text-sm"
    >
      <div className="relative flex h-10 w-full max-w-[800px] flex-1 shrink-0 items-center rounded-md ring ring-slate-200 transition-colors focus-within:ring-2 focus-within:ring-emerald-600">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <Input
          placeholder={placeholder}
          className="peer block size-full rounded-md py-2 pr-9 pl-3.5 text-base caret-slate-600 placeholder:text-slate-500 focus-visible:outline-none "
          value={searchValue}
          onChange={(e) => {
            const newValue = e.target.value;
            setSearchValue(newValue);
            handleSearch(newValue);
          }}
        />
        {hasQuery && (
          <button
            onClick={clearSearch}
            className="-translate-y-1/2 absolute top-1/2 right-3 z-1 flex size-6 items-center justify-center rounded-full hover:cursor-pointer"
            type="reset"
          >
            <ClearIcon className="size-6 text-white" />
          </button>
        )}
        {!hasQuery && (
          <SearchIcon className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-3 z-1 size-6 text-white " />
        )}
        <span className="ml-auto h-full w-12.5 rounded-r-md bg-emerald-600 ring ring-emerald-600" />
      </div>
    </div>
  );
}
