import type { Alumni } from "@/lib/types";
import { getBaseUrl } from "@/lib/utils";
import Image from "next/image";

async function fetchAlumni(): Promise<Alumni[]> {
  const baseUrl = await getBaseUrl();
  const response = await fetch(`${baseUrl}/api/alumni?count=20`);
  if (!response.ok) {
    throw new Error("Failed to fetch alumni data");
  }
  return response.json();
}

export default async function AlumniTable() {
  const alumni = await fetchAlumni();

  return (
    <div className="">
      {alumni.map((alumni) => (
        <div key={alumni.id} className="flex gap-10 text-sm">
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
          <p>{alumni.name}</p>
          <p>{alumni.job}</p>
          <p>{alumni.email}</p>
          <p>{alumni.phone}</p>
        </div>
      ))}
    </div>
  );
}
