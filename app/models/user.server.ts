import { Prisma } from "@prisma/client";
import { prisma } from "~/db.server";

export type sortEmail = "sortByEmaildesc" | "sortByEmailasc";

type pagination = {
  $skip?: number;
  $take?: number;
  search?: string;
  sortByEmail?: sortEmail;
};

export async function getAllUser({
  $skip = 0,
  $take = 0,
  search,
  sortByEmail,
}: pagination) {
  const whereQuery: Prisma.UserWhereInput = {
    name: search ? { contains: search } : undefined,
  };

  const orderByQuery: Prisma.UserOrderByWithAggregationInput = {
    email: sortByEmail?.includes("desc") ? "desc" : "asc",
  };
  const [users, count] = await prisma.$transaction([
    prisma.user.findMany({
      skip: $skip,
      take: $take,
      where: { ...whereQuery },
      orderBy: { ...orderByQuery },
    }),
    prisma.user.count({ where: { ...whereQuery } }),
  ]);

  const addedUsers = users.map((user) => {
    return {
      ...user,
      subRows: user.id,
    };
  });
  console.log("addedUsers", addedUsers[0]);

  return { users: addedUsers, count };
}
