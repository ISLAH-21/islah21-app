import { usePathname, useRouter, useSearchParams } from "next/navigation";
import PreviousPageIcon from "./icons/mynaui:chevron-left.svg";
import NextPageIcon from "./icons/mynaui:chevron-right.svg";

interface AlumniPaginationProps {
  data: {
    currentPage: number;
    totalPages: number;
    hasMore: boolean;
    isFetching: boolean;
  };
}

export default function AlumniPagination({ data }: AlumniPaginationProps) {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  function goTo(newPage: number) {
    const params = new URLSearchParams(searchParams);
    if (newPage > 1) params.set("page", String(newPage));
    else params.delete("page");
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex w-full items-center justify-center gap-2 py-10 text-sm">
      <button
        onClick={() => goTo(data.currentPage - 1)}
        disabled={data.currentPage === 1 || data.isFetching}
        className="rounded-sm p-1 ring ring-slate-300 hover:cursor-pointer hover:bg-slate-100"
        type="button"
      >
        <PreviousPageIcon className="size-5 text-slate-500" />
      </button>
      <span className="px-2 font-medium text-slate-700 tabular-nums">
        {data.currentPage} / {data.totalPages || 1}
      </span>
      <button
        onClick={() => goTo(data.currentPage + 1)}
        disabled={!data.hasMore || data.isFetching}
        className="rounded-sm p-1 ring ring-slate-300 hover:cursor-pointer hover:bg-slate-100"
        type="button"
      >
        <NextPageIcon className="size-5 text-slate-500" />
      </button>
    </div>
  );
}
