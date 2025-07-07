import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Islah21 Alumni Directory",
  description: "Official alumni directory of Islah21",
  keywords: "Islah21, alumni, directory",
  authors: { name: "Hengker" },
};

export default function Page() {
  return (
    <div className="mx-auto min-h-dvh max-w-[1200px] px-4 tracking-tight">
      <section></section>
      <section
        id="directory-search"
        className="flex items-center justify-center gap-x-2 py-4"
      >
        <div
          id="search-filter"
          className="mb-auto h-full max-h-[400px] w-full max-w-[200px] rounded-sm bg-slate-200 px-5"
        >
          Filter
        </div>
        <div className="min-h-dvh w-full max-w-[800px] rounded-sm bg-slate-200 px-2">
          tes
        </div>
      </section>
    </div>
  );
}
