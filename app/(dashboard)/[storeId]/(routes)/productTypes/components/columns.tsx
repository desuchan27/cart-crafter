"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cellAction"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type TypeColumn = {
  id: string
  name: string
  createdAt: string
}

export const columns: ColumnDef<TypeColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original}/>
  }
]
