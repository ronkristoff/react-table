// import { getAllUser } from "~/models/user.server";
// import { Form, Outlet, useLoaderData } from "@remix-run/react";
// import { DataTable } from "~/components/shared/data-table";
// import { defaultColumns } from "~/components/ui/users/columns";
// import { LoaderFunctionArgs } from "@remix-run/node";
// import {
//   PaginationState,
//   getCoreRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import { PaginationBar } from "~/components/shared/pagination";
// import { Input } from "~/components/ui/input";

import { Outlet } from "@remix-run/react";

export default function Page() {
  return (
    <div className="w-3/4 mx-auto p-4">
      <p>Layout</p>
      <Outlet />
      {/* <Form method="GET">
        <Input
          type="text"
          name="search"
          className="w-96"
          placeholder="Search name"
        />
        <DataTable table={table} columns={defaultColumns} />
        <PaginationBar total={total} />
        {JSON.stringify(table.getFilteredSelectedRowModel().rows, null, 2)}
      </Form> */}
    </div>
  );
}
