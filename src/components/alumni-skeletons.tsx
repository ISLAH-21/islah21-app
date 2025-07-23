export function AlumniTablesSkeleton({ items }: { items: number }) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 pt-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: items }, () => (
        <div
          key={`table-skeleton-${crypto.randomUUID()}`}
          className="flex flex-col gap-y-2 rounded-lg py-4 ring ring-slate-200 md:gap-x-4"
        >
          <div className="flex w-full flex-col px-6">
            <span className="size-20 animate-pulse rounded-full bg-slate-200" />
          </div>
          <div className="flex w-full flex-col gap-y-2 px-6 pt-1">
            <span className="h-6 w-full max-w-45 animate-pulse rounded-md bg-slate-200" />
            <span className="h-5 w-full max-w-55 animate-pulse rounded-md bg-slate-200" />
          </div>
          <div className="my-3 h-[0.75px] w-full scale-y-100 bg-slate-200" />
          <div className="flex w-full flex-col gap-y-2 px-4">
            <span className="h-10 w-full animate-pulse rounded-md bg-slate-200" />
            <span className="h-10 w-full animate-pulse rounded-md bg-slate-200" />
            <span className="h-10 w-full animate-pulse rounded-md bg-slate-200" />
          </div>
          <div className="mt-3 mb-2 h-[0.75px] w-full scale-y-100 bg-slate-200" />
          <div className="flex w-full gap-x-2 px-4">
            <span className="size-8 animate-pulse rounded-full bg-slate-200" />
            <span className="size-8 animate-pulse rounded-full bg-slate-200" />
            <span className="size-8 animate-pulse rounded-full bg-slate-200" />
            <span className="size-8 animate-pulse rounded-full bg-slate-200" />
            <span className="size-8 animate-pulse rounded-full bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AlumniSearchSkeleton() {
  return (
    <div className="justify-baseline flex size-full items-center gap-x-2">
      <span className="h-10 w-full max-w-[800px] animate-pulse rounded-md bg-slate-200 ring ring-slate-300" />
    </div>
  );
}

export function AlumniSectionSkeleton({ items }: { items: number }) {
  return (
    <div className="mx-auto flex h-full w-full max-w-[1440px] flex-col items-start justify-center">
      <div className="flex w-full flex-col px-4 pt-4">
        <AlumniSearchSkeleton />
        <AlumniTablesSkeleton items={items} />
      </div>
    </div>
  );
}
