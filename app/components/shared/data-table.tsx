import * as React from "react";
// import type {
//   DataTableFilterableColumn,
//   DataTableSearchableColumn,
// } from "./types";

import {
  flexRender,
  type ColumnDef,
  type Table as TanstackTable,
  SortDirection,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Link } from "@remix-run/react";
import { parse } from "path";

// import { DataTableAdvancedToolbar } from "./advance/data-table-advanced-toolbar";
// import { DataTableFloatingBar } from "./data-table-floating-bar";
// import { DataTablePagination } from "./data-table-pagination";
// import { DataTableToolbar } from "./data-table-toolbar";
// import { DataTableFilterableColumn, DataTableSearchableColumn } from ".";

interface DataTableProps<TData, TValue> {
  /**
   * The table instance returned from useDataTable hook with pagination, sorting, filtering, etc.
   * @type TanstackTable<TData>
   */
  table: TanstackTable<TData>;

  /**
   * The columns of the table
   * @default []
   * @type ColumnDef<TData, TValue>[]
   */
  columns: ColumnDef<TData, TValue>[];

  // /**
  //  * The searchable columns of the table
  //  * @default []
  //  * @type {id: keyof TData, title: string}[]
  //  * @example searchableColumns={[{ id: "title", title: "titles" }]}
  //  */
  // searchableColumns?: DataTableSearchableColumn<TData>[];

  // /**
  //  * The filterable columns of the table. When provided, renders dynamic faceted filters, and the advancedFilter prop is ignored.
  //  * @default []
  //  * @type {id: keyof TData, title: string, options: { label: string, value: string, icon?: React.ComponentType<{ className?: string }> }[]}[]
  //  * @example filterableColumns={[{ id: "status", title: "Status", options: ["todo", "in-progress", "done", "canceled"]}]}
  //  */
  // filterableColumns?: DataTableFilterableColumn<TData>[];

  /**
   * Show notion like filters when enabled
   * @default false
   * @type boolean
   */
  advancedFilter?: boolean;

  /**
   * The content to render in the floating bar on row selection, at the bottom of the table. When null, the floating bar is not rendered.
   * The datTable instance is passed as a prop to the floating bar content.
   * @default null
   * @type React.ReactNode | null
   * @example floatingBarContent={TasksTableFloatingBarContent(dataTable)}
   */
  floatingBarContent?: React.ReactNode | null;

  /**
   * The action to delete rows
   * @default undefined
   * @type React.MouseEventHandler<HTMLButtonElement> | undefined
   * @example deleteRowsAction={(event) => deleteSelectedRows(dataTable, event)}
   */
  deleteRowsAction?: React.MouseEventHandler<HTMLButtonElement>;
}

export function DataTable<TData, TValue>({
  table,
  columns,
}: // searchableColumns = [],
// filterableColumns = [],
// advancedFilter = false,
// floatingBarContent,
// deleteRowsAction,
DataTableProps<TData, TValue>) {
  // const formatUrl = (
  //   column: string,
  //   sortValue: string,
  //   test: string | null
  // ) => {
  //   console.log("column", column);
  //   console.log("sortValue", sortValue);
  //   console.log("table", table.getColumn("id")?.getIsSorted());

  //   if (test) {
  //     return `?${column}&${test}`;
  //   }
  //   return `?${column}`;
  // };
  return (
    <div className="w-full space-y-2.5 overflow-auto">
      {/* {advancedFilter ? (
        <DataTableAdvancedToolbar
          table={table}
          filterableColumns={filterableColumns}
          searchableColumns={searchableColumns}
        />
      ) : (
        <DataTableToolbar
          table={table}
          filterableColumns={filterableColumns}
          searchableColumns={searchableColumns}
          deleteRowsAction={deleteRowsAction}
        />
      )} */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                        // <Link
                        //   onClick={header.column.getToggleSortingHandler()}
                        //   // to={`#${header.column.getIsSorted() as string}`}
                        //   to={`${formatUrl(
                        //     header.column.columnDef.header?.toString() || "",
                        //     header.column.getIsSorted() as string,
                        //     {
                        //       asc: " 🔼",
                        //       desc: " 🔽",
                        //     }[header.column.getIsSorted() as string] ?? null
                        //   )}`}
                        // >
                        //   {flexRender(
                        //     header.column.columnDef.header,
                        //     header.getContext()
                        //   )}
                        //   {{
                        //     asc: " 🔼",
                        //     desc: " 🔽",
                        //   }[header.column.getIsSorted() as string] ?? null}
                        //   {header.column.getIsSorted() as string}
                        //   <div>
                        //     <span>
                        //       {header.column.columnDef.header as string}
                        //       {header.column.getIsSorted() as string}
                        //     </span>
                        //   </div>
                        // </Link>
                      )}
                    </th>
                  );
                  // return (
                  //   <TableHead key={header.id}>
                  //     {header.isPlaceholder
                  //       ? null
                  //       : flexRender(
                  //           header.column.columnDef.header,
                  //           header.getContext()
                  //         )}
                  //   </TableHead>
                  // );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="space-y-2.5">
        {/* <DataTablePagination table={table} />
        {floatingBarContent ? (
          <DataTableFloatingBar table={table}>
            {floatingBarContent}
          </DataTableFloatingBar>
        ) : null} */}
      </div>
    </div>
  );
}
