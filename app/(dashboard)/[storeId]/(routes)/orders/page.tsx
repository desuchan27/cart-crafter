import { format } from "date-fns";

import db from "@/lib/db";
import { formatter } from "@/lib/utils";

import { OrderColumn } from "./components/columns";
import { OrderClient } from "./components/client";

const OrdersPage = async ({
  params,
}: {
  params: { storeId: string };
}) => {
  const orders = await db.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders: OrderColumn[] = orders.map((item) => {
    const quantity = item.orderItems.reduce(
      (total, orderItem) => total + orderItem.quantity,
      0
    );

    return {
      orderId: item.id,
      id: item.id,
      phone: item.phone,
      address: item.address,
      customerName: item.customerName,
      products: item.orderItems
        .map(
          (orderItem) =>
            `${orderItem.product.name} (${orderItem.quantity})`
        )
        .join(", "),
      quantity, // renamed from totalQuantity to quantity
      totalPrice: formatter.format(item.orderItems.reduce((total, item) => {
        return total + Number(item.product.price)
      }, 0)),
      isPaid: item.isPaid,
      createdAt: format(item.createdAt, 'MMMM do, yyyy'),
    };
});

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
