"use client";

import type { AlumniProps } from "@/lib/types";
import Image from "next/image";
import { useEffect, useState } from "react";
import Facebook from "./icons/fa6-brands:facebook-f.svg";
import Instagram from "./icons/fa6-brands:instagram.svg";
import LinkedIn from "./icons/fa6-brands:linkedin-in.svg";
import WhatsApp from "./icons/fa6-brands:whatsapp.svg";
import X from "./icons/fa6-brands:x-twitter.svg";
import Email from "./icons/fa6-regular:envelope.svg";

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
    <div className="flex w-full flex-col gap-y-2 pt-2 tracking-tight">
      {alumni.map((alumni) => (
        <div
          key={alumni.id}
          className="flex items-center gap-x-3 rounded-md border p-2 text-[11px] leading-[1.2] md:gap-x-4 md:text-[13px]"
        >
          {alumni.avatar ? (
            <Image
              src={alumni.avatar}
              alt={alumni.name}
              className="size-8 rounded-full md:size-10"
              width={40}
              height={40}
            />
          ) : (
            <span className="h-8 max-w-8 rounded-full bg-slate-300 md:h-10 md:w-full md:max-w-10" />
          )}
          <div className="-space-y-0.5 flex w-full max-w-40 flex-col justify-center whitespace-nowrap md:max-w-50">
            <p className="truncate font-semibold text-xs md:text-sm">
              {alumni.name}
            </p>
            <p className="truncate text-slate-500">{alumni.job}</p>
          </div>

          <div className="flex w-full max-w-40 flex-col justify-center gap-y-0.5 md:max-w-50 ">
            <a
              className="flex min-w-0 items-center gap-x-2 text-slate-700"
              href={`mailto:${alumni.email}`}
            >
              <Email className="size-3 shrink-0 text-slate-500" />
              <span className="truncate whitespace-nowrap">{alumni.email}</span>
            </a>
            <a
              className="flex min-w-0 items-center gap-x-1.75 text-slate-700"
              target="_blank"
              href={`https://wa.me/${alumni.phone}`}
            >
              <WhatsApp className="size-3.25 shrink-0 text-slate-500 " />
              <span className="truncate whitespace-nowrap">{alumni.phone}</span>
            </a>
          </div>

          <div className="mr-1 ml-auto flex items-center gap-x-1.5">
            {alumni.socialMedia?.facebook && (
              <a
                className={`flex size-6 items-end justify-center rounded-full border border-slate-500 hover:cursor-pointer md:size-8 md:border-[1.5px]`}
                target="_blank"
                href={alumni.socialMedia?.facebook}
              >
                <Facebook className="size-4 text-slate-500 md:size-5.5" />
              </a>
            )}
            {alumni.socialMedia?.x && (
              <a
                className={`flex size-6 items-center justify-center rounded-full border border-slate-500 hover:cursor-pointer md:size-8 md:border-[1.5px]`}
                target="_blank"
                href={alumni.socialMedia?.x}
              >
                <X className="size-3 text-slate-500 md:size-4.5" />
              </a>
            )}
            {alumni.socialMedia?.instagram && (
              <a
                className="flex size-6 items-center justify-center rounded-full border border-slate-500 hover:cursor-pointer md:size-8 md:border-[1.5px]"
                target="_blank"
                href={alumni.socialMedia?.instagram}
              >
                <Instagram className="size-3.5 text-slate-500 md:size-5" />
              </a>
            )}
            {alumni.socialMedia?.linkedin && (
              <a
                className="flex size-6 items-center justify-center rounded-full border border-slate-500 hover:cursor-pointer md:size-8 md:border-[1.5px]"
                target="_blank"
                href={alumni.socialMedia?.linkedin}
              >
                <LinkedIn className="size-3 text-slate-500 md:size-4.5" />
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
