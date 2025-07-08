"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function AlumniTable() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlumni() {
      try {
        const res = await fetch("/api/alumni?count=10");
        if (!res.ok) throw new Error("Failed to fetch alumni data");
        const data = await res.json();
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
    <div className="flex w-full flex-col gap-y-2 pt-2">
      {alumni.map((alumni) => (
        <div
          key={alumni.id}
          className="flex items-center gap-x-4 rounded-md border p-2 text-sm leading-none"
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
          <div className="flex w-full max-w-60 flex-col justify-center whitespace-nowrap">
            <p className="truncate font-semibold">{alumni.name}</p>
            <p className="truncate text-slate-500">{alumni.job}</p>
          </div>
          <p className="w-fit min-w-0 max-w-60 flex-1 justify-center whitespace-nowrap font-semibold text-slate-700">
            {alumni.email}
          </p>
          <p className="w-fit min-w-0 max-w-60 flex-1 justify-center whitespace-nowrap font-semibold text-slate-700">
            {alumni.phone}
          </p>
        </div>
      ))}
    </div>
  );
}
