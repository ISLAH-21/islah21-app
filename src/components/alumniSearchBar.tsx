"use client";

import { Input } from "@base-ui-components/react/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import SearchIcon from "./icons/mynaui:search.svg";

interface AlumniSearchBarProps {
  placeholder: string;
}

export default function AlumniSearchBar({ placeholder }: AlumniSearchBarProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search_query", term);
    } else {
      params.delete("search_query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 0);

  return (
    <div className="relative flex flex-1 shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <Input
        placeholder={placeholder}
        className="peer block w-full rounded-md border border-slate-200 py-2 pl-9 text-sm caret-slate-600 placeholder:text-slate-500 focus-visible:outline-[1.5px] focus-visible:outline-slate-600"
        value={searchParams.get("search_query") || ""}
        onChange={(e) => {
          const newValue = e.target.value;
          handleSearch(newValue);
        }}
      />
      <SearchIcon className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-2.5 size-5 text-slate-500 peer-focus-visible:text-slate-800" />
    </div>
  );
}
