// Import necessary modules and dependencies

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./cellAction";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type VariantColumn = {
  id: string;
  name: string;
  options: string[];
  createdAt: string;
};


export const columns: ColumnDef<VariantColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "options",
    header: "Available Options"
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
