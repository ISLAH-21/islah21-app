import AlumniSection from "@/components/alumni-section";

export default function Page() {
  return (
    <>
      <section
        id="header"
        className="flex h-[200px] min-h-full w-full justify-center border-slate-200 border-b bg-emerald-700 text-slate-50 leading-[1.2] "
      >
        <div className="flex w-full max-w-[1440px] flex-col p-6 tracking-tighter">
          <h1 className="font-semibold text-6xl tracking-[-0.06em]">
            Alumni Directory
          </h1>
          <p className="text-xl">Search and filter alumni</p>
        </div>
      </section>
      <AlumniSection />
    </>
  );
}
