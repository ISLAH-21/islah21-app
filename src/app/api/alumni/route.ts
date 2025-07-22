import type { AlumniProps } from "@/lib/types";
import { faker } from "@faker-js/faker";
import { NextResponse } from "next/server";

faker.seed(68);

const OPERATOR_PREFIXES = [
  "811",
  "812",
  "813",
  "821",
  "822",
  "823",
  "831",
  "832",
  "833",
  "851",
  "852",
  "853",
  "871",
  "872",
  "873",
  "881",
  "882",
  "883",
];

const generateFakeData = (): Omit<AlumniProps, "id"> => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  const operatorPrefix = faker.helpers.arrayElement(OPERATOR_PREFIXES);
  const phoneLength = faker.number.int({ min: 7, max: 10 });
  const phone = `+62${operatorPrefix}${faker.string.numeric(phoneLength)}`;

  const user: Omit<AlumniProps, "id"> = {
    name: `${firstName} ${lastName}`,
    job: faker.person.jobTitle(),
    residence: faker.location.city(),
    email: faker.internet.email({ firstName, lastName }),
    phone,
    ...(faker.datatype.boolean(0.9) && { avatar: faker.image.avatar() }),
  };

  if (faker.datatype.boolean(0.95)) {
    user.socialMedia = {
      ...(faker.datatype.boolean(0.6) && {
        x: `https://x.com/${faker.internet.username({ firstName, lastName })}`,
      }),
      ...(faker.datatype.boolean(0.8) && {
        linkedin: `https://linkedin.com/in/${faker.internet.username({ firstName, lastName })}`,
      }),
      ...(faker.datatype.boolean(0.5) && {
        github: `https://github.com/${faker.internet.username({ firstName, lastName })}`,
      }),
      ...(faker.datatype.boolean(0.9) && {
        instagram: `https://instagram.com/${faker.internet.username({ firstName, lastName })}`,
      }),
      ...(faker.datatype.boolean(0.8) && {
        facebook: `https://facebook.com/${faker.internet.username({ firstName, lastName })}`,
      }),
      ...(faker.datatype.boolean(0.5) && {
        behance: `https://behance.net/${faker.internet.username({ firstName, lastName })}`,
      }),
    };
  }

  if (faker.datatype.boolean(0.6)) {
    user.personalSite = faker.internet.url();
  }

  return user;
};

export const generateFakeUsers = (): AlumniProps[] => {
  faker.seed(68);
  return Array.from({ length: 200 }, (_, i) => ({
    id: i + 1,
    ...generateFakeData(),
  }));
};

const ALL_ALUMNI: AlumniProps[] = generateFakeUsers();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const count = parseInt(searchParams.get("count") ?? "12", 10);
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const searchQuery = searchParams.get(
    "search_query"?.toLowerCase().trim() || "",
  );

  let filteredAlumni: AlumniProps[] = ALL_ALUMNI;

  if (searchQuery) {
    filteredAlumni = ALL_ALUMNI.filter(
      (alumni) =>
        alumni.name.toLowerCase().includes(searchQuery) ||
        alumni.job?.toLowerCase().includes(searchQuery) ||
        alumni.email?.toLowerCase().includes(searchQuery) ||
        alumni.residence?.toLowerCase().includes(searchQuery),
    );
  }

  const startIndex = (page - 1) * count;
  const endIndex = startIndex + count;
  const paginatedAlumni = filteredAlumni.slice(startIndex, endIndex);
  const hasMore = endIndex < filteredAlumni.length;
  const totalPages = Math.ceil(filteredAlumni.length / count);

  return NextResponse.json({
    users: paginatedAlumni,
    hasMore,
    totalResults: filteredAlumni.length,
    totalPages,
    currentPage: page,
    resultsPerPage: count,
    isFiltered: Boolean(searchQuery),
  });
}
