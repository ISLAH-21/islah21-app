"use client";

import { getInitials } from "@/lib/string";
import type { AlumniProps } from "@/lib/types";
import { Avatar } from "@base-ui-components/react";
import AlumniSocial from "./alumniSocial";
import EmailIcon from "./icons/mynaui:envelope.svg";
import ResidenceIcon from "./icons/mynaui:location.svg";
import TelephoneIcon from "./icons/mynaui:telephone.svg";

interface AlumniTableProps {
  alumni: AlumniProps[] | undefined;
}

function hasLinks(a: AlumniProps): boolean {
  return (
    (a.socialMedia &&
      Object.values(a.socialMedia).filter(Boolean).length > 0) ||
    !!a.personalSite
  );
}

export default function AlumniTable({ alumni = [] }: AlumniTableProps) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 space-y-4 pt-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.isArray(alumni)
        ? alumni.map((alumni) => (
            <div
              key={alumni.id}
              className="flex break-inside-avoid flex-col gap-y-2 rounded-lg py-4 text-sm leading-[1.2] tracking-tight ring ring-slate-200 md:gap-x-4 md:text-base"
            >
              <div className="flex w-full items-center px-6">
                <Avatar.Root className="inline-flex size-20 select-none items-center justify-center overflow-hidden rounded-full bg-slate-100 align-middle ">
                  <Avatar.Image
                    src={alumni.avatar}
                    alt={alumni.name}
                    width={80}
                    height={80}
                    className="size-full object-cover"
                  />
                  <Avatar.Fallback className="flex size-full items-center justify-center font-semibold text-lg text-slate-700 tracking-normal">
                    {getInitials(alumni.name)}
                  </Avatar.Fallback>
                </Avatar.Root>
              </div>
              <div className="flex w-full flex-col whitespace-nowrap px-6">
                <p className="truncate font-semibold text-lg ">{alumni.name}</p>
                <p className="truncate text-slate-500">{alumni.job}</p>
              </div>

              <div className="my-3 h-[0.75px] w-full scale-y-100 bg-slate-200" />

              <div className="flex w-full flex-col gap-y-2 px-4 text-sm">
                {alumni.email && (
                  <a
                    className="group flex min-w-0 items-center gap-x-2 rounded-md bg-slate-100 px-3 py-2.5 ring ring-slate-200 hover:ring-slate-300 [&>*]:text-slate-600 [&>*]:group-hover:text-slate-800"
                    href={`mailto:${alumni.email}`}
                  >
                    <EmailIcon className="size-5 shrink-0" />
                    <p className="truncate">Email</p>
                    <span className="ml-auto truncate whitespace-nowrap">
                      {alumni.email}
                    </span>
                  </a>
                )}
                {alumni.phone && (
                  <a
                    className="group flex min-w-0 items-center gap-x-2 rounded-md bg-slate-100 px-3 py-2.5 ring ring-slate-200 hover:ring-slate-300 [&>*]:text-slate-600 [&>*]:group-hover:text-slate-800"
                    target="_blank"
                    href={`https://wa.me/${alumni.phone}`}
                  >
                    <TelephoneIcon className="size-5 shrink-0 " />
                    <p className="truncate ">Phone</p>
                    <span className="ml-auto truncate whitespace-nowrap tabular-nums ">
                      {alumni.phone}
                    </span>
                  </a>
                )}
                {alumni.residence && (
                  <div className="group flex min-w-0 items-center gap-x-2 rounded-md bg-slate-100 px-3 py-2.5 ring ring-slate-200 hover:ring-slate-300 [&>*]:text-slate-600 [&>*]:group-hover:text-slate-800">
                    <ResidenceIcon className="size-5 shrink-0" />
                    <p className="truncate">Residence</p>
                    <span className="ml-auto truncate whitespace-nowrap">
                      {alumni.residence}
                    </span>
                  </div>
                )}
              </div>

              {hasLinks(alumni) && (
                <>
                  <div className="mt-3 mb-2 h-[0.75px] w-full scale-y-100 bg-slate-200" />
                  <AlumniSocial alumni={alumni} />
                </>
              )}
            </div>
          ))
        : null}
    </div>
  );
}
