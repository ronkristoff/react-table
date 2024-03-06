import { getAllUser, sortEmail } from "~/models/user.server";
import {
  Form,
  useLoaderData,
  useNavigate,
  useNavigation,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import { DataTable } from "~/components/shared/data-table";
import { UserColumns, defaultColumns } from "~/components/ui/users/columns";
import { LoaderFunctionArgs } from "@remix-run/node";
import {
  ExpandedState,
  PaginationState,
  RowSelectionState,
  SortingState,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  PaginationBar,
  setSearchParamsString,
} from "~/components/shared/pagination";
import { Input } from "~/components/ui/input";
import React, { useEffect } from "react";
import { Button } from "~/components/ui/button";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const $take = Number(url.searchParams.get("$take")) || 10;
  const $skip = Number(url.searchParams.get("$skip")) || 0;
  const sortByEmailPos = url.searchParams.get("searchEmail") || "";
  const sortByEmail: sortEmail = ("sortByEmail" + sortByEmailPos) as sortEmail;

  console.log("sortByEmail", sortByEmail);
  const search = url.searchParams.get("search") || "";

  const { users, count } = await getAllUser({
    $take,
    $skip,
    search,
    sortByEmail,
  });
  return { users, total: count };
};

export default function Page() {
  const { users, total } = useLoaderData<typeof loader>();
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const pagination: PaginationState = {
    pageIndex: 1,
    pageSize: total,
  };

  const navigate = useNavigate();
  const table = useReactTable<UserColumns>({
    data: users,
    columns: defaultColumns,
    state: {
      pagination,
      sorting,
    },
    rowCount: total,
    onSortingChange: setSorting,
    manualPagination: true,
    manualSorting: true,
    enableMultiSort: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const [searchParams] = useSearchParams();

  const submit = useSubmit();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    submit(formData);
  };

  useEffect(() => {
    if (sorting.length == 0) {
      navigate({
        pathname: "/users",
        search: "",
      });
    }
    if (sorting.length > 0) {
      navigate({
        pathname: "/users",
        search: `?sort=${sorting[0]?.id}${
          sorting[0]?.desc == false ? "Asc" : "Desc"
        }`,
      });
    }
  }, [navigate, sorting]);
  {
    console.log(table.getState().rowSelection); //get the row selection state - { 1: true, 2: false, etc... }
    console.log(table.getSelectedRowModel().rows); //get full client-side selected rows
    console.log(table.getFilteredSelectedRowModel().rows); //get filtered client-side selected rows
    console.log(table.getGroupedSelectedRowModel().rows);
  }
  return (
    <Form method="GET" onSubmit={onSubmit}>
      <Input
        type="text"
        name="searchName"
        className="w-96"
        placeholder="Search name"
      />
      <Input
        type="text"
        name="searchEmail"
        className="w-96"
        placeholder="Search email"
      />
      <Button type="submit">Search</Button>
      <DataTable table={table} columns={defaultColumns} />
      <PaginationBar total={total} />
      {JSON.stringify(table.getFilteredSelectedRowModel().rows, null, 2)}
      {JSON.stringify(table.getColumn("id")?.getIsSorted, null, 2)}
    </Form>
  );
}
