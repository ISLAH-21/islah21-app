"use client";

import type { AlumniProps } from "@/lib/types";
import Image from "next/image";
import { useEffect, useState } from "react";
import Facebook from "./icons/fa6-brands:facebook-f.svg";
import Instagram from "./icons/fa6-brands:instagram.svg";
import LinkedIn from "./icons/fa6-brands:linkedin-in.svg";
import X from "./icons/fa6-brands:x-twitter.svg";
import Email from "./icons/mynaui:envelope.svg";
import Telephone from "./icons/mynaui:telephone.svg";

export default function AlumniTable() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlumni() {
      try {
        const res = await fetch("/api/alumni?count=10");
        if (!res.ok) throw new Error("Failed to fetch alumni data");
        const data = (await res.json()) as AlumniProps[];
        setAlumni(data);
      } catch (error) {
        console.error("Error fetching alumni data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAlumni();
  }, []);

  // later skeleton
  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid w-full grid-cols-1 flex-col gap-4 pt-4 tracking-tight md:grid-cols-2 lg:grid-cols-3">
      {alumni.map((alumni) => (
        <div
          key={alumni.id}
          className="flex flex-col gap-y-2 rounded-lg pt-6 pb-4 text-sm leading-[1.2] ring ring-slate-200 md:gap-x-4 md:text-base"
        >
          <div className="flex w-full items-center px-6">
            {alumni.avatar ? (
              <Image
                src={alumni.avatar}
                alt={alumni.name}
                className="aspect-square size-20 rounded-full"
                width={80}
                height={80}
              />
            ) : (
              <span className="aspect-square size-20 rounded-full bg-slate-300" />
            )}
          </div>
          <div className="flex w-full flex-col whitespace-nowrap px-6">
            <p className="truncate font-semibold text-lg ">{alumni.name}</p>
            <p className="truncate text-slate-500">{alumni.job}</p>
          </div>

          <div className="my-2 h-[0.75px] w-full scale-y-100 bg-slate-200" />

          <div className="flex w-full flex-col gap-y-2 px-4 text-sm">
            <a
              className="group flex min-w-0 items-center gap-x-2 rounded-md bg-slate-100 px-3 py-2.5 ring ring-slate-200 hover:ring-slate-300 [&>*]:text-slate-600 [&>*]:group-hover:text-slate-800"
              href={`mailto:${alumni.email}`}
            >
              <Email className="size-5 shrink-0" />
              <p className="truncate">Email</p>
              <span className="ml-auto truncate whitespace-nowrap">
                {alumni.email}
              </span>
            </a>
            <a
              className="group flex min-w-0 items-center gap-x-2 rounded-md bg-slate-100 px-3 py-2.5 ring ring-slate-200 hover:ring-slate-300 [&>*]:text-slate-600 [&>*]:group-hover:text-slate-800"
              target="_blank"
              href={`https://wa.me/${alumni.phone}`}
            >
              <Telephone className="size-5 shrink-0 " />
              <p className="truncate ">Phone</p>
              <span className="ml-auto truncate whitespace-nowrap tabular-nums ">
                {alumni.phone}
              </span>
            </a>
          </div>

          <div className="flex w-full px-4 pt-3">
            <div className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 ring ring-slate-200 [&>*>*]:text-slate-500 [&>*>*]:group-hover:text-slate-600 [&>*]:ring [&>*]:ring-slate-200 [&>*]:hover:ring-slate-300">
              {alumni.socialMedia?.facebook && (
                <a
                  className={`group flex size-8 items-end justify-center rounded-full bg-slate-100 hover:cursor-pointer `}
                  target="_blank"
                  href={alumni.socialMedia?.facebook}
                >
                  <Facebook className="size-5.5" />
                </a>
              )}
              {alumni.socialMedia?.x && (
                <a
                  className={`group flex size-8 items-center justify-center rounded-full bg-slate-100 hover:cursor-pointer`}
                  target="_blank"
                  href={alumni.socialMedia?.x}
                >
                  <X className=" size-4.5" />
                </a>
              )}
              {alumni.socialMedia?.instagram && (
                <a
                  className="group flex size-8 items-center justify-center rounded-full bg-slate-100 hover:cursor-pointer"
                  target="_blank"
                  href={alumni.socialMedia?.instagram}
                >
                  <Instagram className="size-5" />
                </a>
              )}
              {alumni.socialMedia?.linkedin && (
                <a
                  className="group flex size-8 items-center justify-center rounded-full bg-slate-100 hover:cursor-pointer"
                  target="_blank"
                  href={alumni.socialMedia?.linkedin}
                >
                  <LinkedIn className="size-4.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
