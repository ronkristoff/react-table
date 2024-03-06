import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { MRT_ColumnDef, MRT_SortingState } from "material-react-table";
import { getAllUser, sortEmail } from "~/models/user.server";
import { useHydrated } from "remix-utils/use-hydrated";
import MUITable from "~/components/shared/muitable";
import { User } from "@prisma/client";
import { useState } from "react";

export const data = [
  {
    id: "1",
    firstName: "Dylan",
    middleName: "Sprouse",
    lastName: "Murray",
    address: "261 Erdman Ford",
    city: "East Daphne",
    state: "Kentucky",
    country: "United States",
  },
  {
    id: "2",
    firstName: "Raquel",
    middleName: "Hakeem",
    lastName: "Kohler",
    address: "769 Dominic Grove",
    city: "Vancouver",
    state: "British Columbia",
    country: "Canada",
  },
  {
    id: "3",
    firstName: "Ervin",
    middleName: "Kris",
    lastName: "Reinger",
  },
  {
    id: "4",
    firstName: "Brittany",
    middleName: "Kathryn",
    lastName: "McCullough",
    address: "722 Emie Stream",
    city: "Lincoln",
    state: "Nebraska",
    country: "United States",
  },
  {
    id: "5",
    firstName: "Branson",
    middleName: "John",
    lastName: "Frami",
  },
];

export type Person = {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
};
const personColumns: MRT_ColumnDef<Person>[] = [
  {
    accessorKey: "id",
    header: "ID",
    size: 50,
  },
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "middleName",
    header: "Middle Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
];

const columns: MRT_ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "First Name",
  },
  {
    accessorKey: "email",
    header: "Last Name",
  },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  // console.log(url);
  const $take = Number(url.searchParams.get("$take")) || 10;
  const $skip = Number(url.searchParams.get("$skip")) || 0;
  const sortByEmailPos = url.searchParams.get("email") || "";
  const sortByEmail: sortEmail = ("sortByEmail" + sortByEmailPos) as sortEmail;

  console.log("sortByEmail", sortByEmail);
  const search = url.searchParams.get("search") || "";
  console.log("----------------- loader -----------------");

  const { users, count } = await getAllUser({
    $take,
    $skip,
    search,
    sortByEmail,
  });
  return { users: users, total: count };
};

export default function Users() {
  const { users, total } = useLoaderData<typeof loader>();
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const isHydrated = useHydrated();

  if (isHydrated) {
    return (
      <MUITable
        columns={columns}
        data={users}
        totalRows={users.length}
        manualSorting={true}
        sorting={sorting}
        setSorting={setSorting}
        renderDetail={({ row }) => {
          return (
            <div>
              <div>{row.original.password}</div>
              <div>{row.original.email}</div>
            </div>
          );
        }}
        // pagination={pagination}
        // setPagination={setPagination}
      />
    );
  } else {
    return <div>Loading else...</div>;
  }
}
