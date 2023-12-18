import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import db from "@/lib/db";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    const { productIds } = await req.json();

    if (!productIds || productIds.length === 0) {
        return new NextResponse("Product ids are required", { status: 400 });
    }

    const order = await db.order.create({
        data: {
            storeId: params.storeId,
            isPaid: false,
            orderItems: {
                create: productIds.map((product: { id: string, quantity: number }) => ({
                    product: {
                        connect: {
                            id: product.id
                        }
                    },
                    quantity: product.quantity
                }))
            }
        },
        include: {
            orderItems: true,
        },
    });

    const products = await db.product.findMany({
        where: {
            id: {
                in: productIds.map((product: { id: string }) => product.id),
            },
        },
    });

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    if (order.orderItems) {
        order.orderItems.forEach((orderItem: { productId: string, quantity: number }) => {
            const product = products.find((p) => p.id === orderItem.productId);
            const quantity = orderItem.quantity || 1;

            if (product) {
                line_items.push({
                    quantity,
                    price_data: {
                        currency: 'PHP',
                        product_data: {
                            name: product.name,
                        },
                        unit_amount: product.price.toNumber() * 100
                    }
                });
            }
        });
    }


    if (order.orderItems) {
        order.orderItems.forEach((orderItem: any) => {
            const product = products.find((p) => p.id === orderItem.productId);
            const quantity = orderItem.quantity || 1;

            if (product) {
                line_items.push({
                    quantity,
                    price_data: {
                        currency: 'PHP',
                        product_data: {
                            name: product.name,
                        },
                        unit_amount: product.price.toNumber() * 100
                    }
                });
            }
        });
    }

    const totalQuantity = line_items.reduce((total, item) => total + (item.quantity || 0), 0);

    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        billing_address_collection: 'required',
        phone_number_collection: {
            enabled: true,
        },
        success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
        cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
        metadata: {
            orderId: order.id,
            quantity: totalQuantity.toString(),
        },
    });


    return NextResponse.json({ url: session.url }, {
        headers: corsHeaders
    });
}
