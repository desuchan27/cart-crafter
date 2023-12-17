"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cellAction"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type SubcategoryColumn = {
  id: string
  name: string
  categoryName: string
  billboardLabel: string
  createdAt: string
}

export const columns: ColumnDef<SubcategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => row.original.categoryName,
  },
  {
    accessorKey: "billboard",
    header: "Billboard",
    cell: ({ row }) => row.original.billboardLabel,
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
