import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import db from "@/lib/db";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        // Verify the webhook event
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        // If verification fails, return an error response
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    // Extract necessary information from the Checkout Session
    const session = event.data.object as Stripe.Checkout.Session;
    const address = session?.customer_details?.address;

    const addressComponents = [
        address?.line1,
        address?.line2,
        address?.city,
        address?.state,
        address?.postal_code,
        address?.country
    ];

    const addressString = addressComponents.filter((c) => c !== null).join(', ');

    // Check if the event is a successful checkout session completion
    if (event.type === "checkout.session.completed") {
        // Update the order in the database with payment status and address information
        const order = await db.order.update({
            where: {
                id: session?.metadata?.orderId,
            },
            data: {
                isPaid: true,
                address: addressString,
                phone: session?.customer_details?.phone || '',
            },
            include: {
                orderItems: true,
            }
        });

        // Extract product IDs from the order items
        const productIds = order.orderItems.map((orderItem) => orderItem.productId);

        // Update the product quantities and set isArchived to false
        await Promise.all(productIds.map(async (productId) => {
            const orderItem = order.orderItems.find((item) => item.productId === productId);

            const product = await db.product.findUnique({
                where: { id: productId },
            });

            const newQuantity = Math.max(0, product ? product.quantity - (orderItem ? orderItem.quantity : 0) : 0);
            // Decrement the available quantity based on the ordered quantity
            await db.product.update({
                where: { id: productId },
                data: {
                    isArchived: false, // Set isArchived to false
                    quantity: {
                        set: newQuantity,
                    },
                },
            });
        }));
    }

    // Return a success response to Stripe
    return new NextResponse(null, { status: 200 });
}
