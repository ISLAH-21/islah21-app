import type { Alumni } from "@/lib/types";
import { faker } from "@faker-js/faker";
import { NextResponse } from "next/server";

export const generateFakeData = (): Omit<Alumni, "id"> => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  const operatorPrefix = faker.helpers.arrayElement([
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
  ]);

  const phone = `+62${operatorPrefix}${faker.string.numeric(faker.number.int({ min: 7, max: 10 }))}`;

  const user: Omit<Alumni, "id"> = {
    name: `${firstName} ${lastName}`,
    job: faker.person.jobTitle(),
    email: faker.internet.email({ firstName, lastName }),
    phone,
    avatar: faker.image.avatar(),
  };

  if (faker.datatype.boolean(0.7)) {
    user.socialMedia = {
      ...(faker.datatype.boolean(0.6) && {
        twitter: `https://twitter.com/${faker.internet.username({ firstName, lastName })}`,
      }),
      ...(faker.datatype.boolean(0.8) && {
        linkedin: `https://linkedin.com/in/${faker.internet.username({ firstName, lastName })}`,
      }),
      ...(faker.datatype.boolean(0.5) && {
        github: `https://github.com/${faker.internet.username({ firstName, lastName })}`,
      }),
      ...(faker.datatype.boolean(0.4) && {
        instagram: `https://instagram.com/${faker.internet.username({ firstName, lastName })}`,
      }),
    };
  }

  if (faker.datatype.boolean(0.6)) {
    user.personalSite = faker.internet.url();
  }

  return user;
};

export const generateFakeUsers = (count = 10) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    ...generateFakeData(),
  }));
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const count = parseInt(searchParams.get("count")) || 10;
  const users = generateFakeUsers(count);

  return NextResponse.json(users);
}
