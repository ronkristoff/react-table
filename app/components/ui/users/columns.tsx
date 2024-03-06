import { User } from "@prisma/client";
import { createColumnHelper } from "@tanstack/react-table";
import { Checkbox } from "../checkbox";
import { Link } from "@remix-run/react";

export type UserColumns = User & { subRows: string };
const columnHelper = createColumnHelper<UserColumns>();

export const defaultColumns = [
  columnHelper.display({
    id: "selected",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={() => {
          table.toggleAllPageRowsSelected();
        }}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={() => {
          row.toggleSelected();
        }}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
  }),
  columnHelper.display({
    id: "expanded",

    cell: ({ row, getValue, column, table, cell }) => (
      <>
        {/* {row.getCanExpand() ? "test" : ""} */}
        {row.getCanExpand() ? (
          <button
            {...{
              onClick: row.getToggleExpandedHandler(),
              style: { cursor: "pointer" },
            }}
          >
            {row.getIsExpanded() ? "👇" : "👉"}
          </button>
        ) : (
          ""
        )}
        {JSON.stringify(row.index)}
      </>
    ),
  }),
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
    header: "ID",
  }),
  columnHelper.accessor("email", {
    cell: (info) => info.getValue(),
    header: "Email",
  }),
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Link className="py-3 px-4 bg-blue-300 rounded-md" to={row.original.id}>
        View
      </Link>
    ),
  }),
];

// function IndeterminateCheckbox({
//   indeterminate,
//   className = "",
//   ...rest
// }: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
//   const ref = React.useRef<HTMLInputElement>(null!);

//   React.useEffect(() => {
//     if (typeof indeterminate === "boolean") {
//       ref.current.indeterminate = !rest.checked && indeterminate;
//     }
//   }, [ref, indeterminate]);

//   return (
//     <input
//       type="checkbox"
//       ref={ref}
//       className={className + " cursor-pointer"}
//       {...rest}
//     />
//   );
// }

// {
//   /* <input
//       type="checkbox"
//       ref={ref}
//       className={className + " cursor-pointer"}
//       {...rest}
//     /> */
// }
