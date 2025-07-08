import AlumniSearchBar from "@/components/alumniSearchBar";
import AlumniTable from "@/components/alumniTable";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Islah21 Alumni Directory",
  description: "Official alumni directory of Islah21",
  keywords: "Islah21, alumni, directory",
  authors: { name: "Hengker" },
};

export default function Page() {
  return (
    <>
      <section
        id="header"
        className="h-[150px] min-h-full w-full border-slate-200 border-b bg-emerald-700"
      ></section>
      <section
        id="directory-search"
        className="mx-auto flex h-full max-w-[1200px] flex-col items-start justify-center px-2 py-4 tracking-tight"
      >
        <div
          id="filter"
          className="flex h-full w-full max-w-[1200px] items-center justify-center gap-x-2 px-2 text-sm"
        >
          <div className="hidden rounded-md border border-slate-200 px-4 py-2 md:block">
            Filter
          </div>
          <AlumniSearchBar placeholder="Cari nama alumni" />
        </div>
        <div className="flex w-full max-w-[1200px] px-2">
          <AlumniTable />
        </div>
      </section>
    </>
  );
}
