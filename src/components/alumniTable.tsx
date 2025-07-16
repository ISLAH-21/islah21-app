"use client";

import type { AlumniProps } from "@/lib/types";
import Image from "next/image";
import { useEffect, useState } from "react";

import Facebook from "./icons/logos:facebook.svg";
import Github from "./icons/simple-icons:github.svg";
import Instagram from "./icons/skill-icons:instagram.svg";

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
          className="flex items-center gap-x-4 rounded-md border p-2 text-[13px] leading-none"
        >
          {alumni.avatar ? (
            <Image
              src={alumni.avatar}
              alt={alumni.name}
              className="h-10 w-10 rounded-full"
              width={40}
              height={40}
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-slate-300" />
          )}
          <div className="flex w-full max-w-45 flex-col justify-center whitespace-nowrap">
            <p className="truncate font-semibold text-sm">{alumni.name}</p>
            <p className="truncate text-slate-500">{alumni.job}</p>
          </div>
          <hr className="mx-1 h-3/4 w-[0.5px] bg-slate-300" />
          <p className="w-fit min-w-0 max-w-55 flex-1 justify-center whitespace-nowrap text-slate-700">
            {alumni.email}
          </p>
          <hr className="mx-1 h-3/4 w-[0.5px] bg-slate-300" />
          <p className="w-fit min-w-0 max-w-45 flex-1 justify-center whitespace-nowrap text-slate-700">
            {alumni.phone}
          </p>
          <hr className="mx-1 h-3/4 w-[0.5px] bg-slate-300" />
          <div className="mr-1 ml-auto flex items-center gap-x-1.5">
            {alumni.socialMedia?.facebook && (
              <a
                className="flex size-8 items-center justify-center rounded-md bg-[#1877F2] hover:cursor-pointer"
                target="_blank"
                href={alumni.socialMedia?.facebook}
              >
                <Facebook />
              </a>
            )}
            {alumni.socialMedia?.github && (
              <a
                className="flex size-8 items-center justify-center rounded-md bg-[#0F172B] hover:cursor-pointer"
                target="_blank"
                href={alumni.socialMedia?.github}
              >
                <Github className="z-1 size-6 text-white" />
              </a>
            )}
            {alumni.socialMedia?.instagram && (
              <a
                className="flex size-8 items-center justify-center rounded-sm hover:cursor-pointer"
                target="_blank"
                href={alumni.socialMedia?.instagram}
              >
                <Instagram />
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
