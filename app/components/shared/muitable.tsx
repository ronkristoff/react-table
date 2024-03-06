import { Box, Typography } from "@mui/material";
import {
  flexRender,
  type MRT_ColumnDef,
  useMaterialReactTable,
  MRT_RowData,
  MRT_TableBodyCellValue,
  MRT_SortingState,
  MaterialReactTable,
  MRT_Row,
  MRT_TableInstance,
} from "material-react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
// {
//   row: MRT_Row<T>;
//   table: MRT_TableInstance<T>;
// }) => React.ReactNode) | undefined
type TableProps<T extends MRT_RowData> = {
  columns: MRT_ColumnDef<T>[];
  data: T[];
  totalRows: number;
  manualSorting?: boolean;
  sorting: MRT_SortingState;
  setSorting: React.Dispatch<React.SetStateAction<MRT_SortingState>>;
  renderDetail: ({
    row,
    table,
  }: {
    row: MRT_Row<T>;
    table: MRT_TableInstance<T>;
  }) => React.ReactNode | undefined;
};

const MUITable = <T extends MRT_RowData>(props: TableProps<T>) => {
  const {
    columns,
    data,
    totalRows,
    manualSorting,
    sorting,
    setSorting,
    renderDetail,
  } = props;
  const table = useMaterialReactTable({
    columns,
    data,
    manualSorting: manualSorting,
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    enableExpandAll: false,
    displayColumnDefOptions: { "mrt-row-expand": { size: 50 } },
    muiDetailPanelProps: () => ({
      sx: (theme) => ({
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(255,210,244,0.1)"
            : "rgba(0,0,0,0.1)",
      }),
    }),
    //custom expand button rotation
    muiExpandButtonProps: ({ row, table }) => ({
      onClick: () => table.setExpanded({ [row.id]: !row.getIsExpanded() }), //only 1 detail panel open at a time
      sx: {
        transform: row.getIsExpanded() ? "rotate(180deg)" : "rotate(-90deg)",
        transition: "transform 0.2s",
      },
    }),
    //conditionally render detail panel
    // renderDetailPanel: ({ row }) =>
    //   row.original.id ? (
    //     <Box
    //       sx={{
    //         display: "grid",
    //         margin: "auto",
    //         gridTemplateColumns: "1fr 1fr",
    //         width: "100%",
    //       }}
    //     >
    //       <Typography>Address: {row.original.name}</Typography>
    //     </Box>
    //   ) : null,
    renderDetailPanel: renderDetail,
    //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    //MRT display columns can still work, optionally override cell renders with `displayColumnDefOptions`
    // enableRowSelection: true,
    // initialState: {
    //   pagination: { pageSize: 5, pageIndex: 0 },
    //   showGlobalFilter: true,
    // },
    // rowCount: totalRows,

    //customize the MRT components
    // muiPaginationProps: {
    //   rowsPerPageOptions: [5, 10, 15],
    //   variant: "outlined",
    // },
    // paginationDisplayMode: "pages",
  });

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
        {/* <Table>
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
              table.getRowModel().rows.map((row, rowIndex) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <MRT_TableBodyCellValue
                        cell={cell}
                        table={table}
                        staticRowIndex={rowIndex} //just for batch row selection to work
                      />
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
        </Table> */}
        <MaterialReactTable table={table} />;
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
};

export default MUITable;
