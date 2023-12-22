"use client"

import { ColumnDef } from "@tanstack/react-table"

export type OrderColumn = {
  id: string;
  orderId: string;
  phone: string;
  address: string;
  customerName: string;
  quantity: number;
  isPaid: boolean;
  totalPrice: string;
  products: string;
  createdAt: string;
}

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "customerName",
    header: "Customer name",
  },
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "quantity", // Add quantity property
    header: "Total Quantity",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    header: "Total price",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
  },
];