import db from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"


export async function GET(
    req: Request,
    { params }: { params: { variantId: string } }
) {
    try {

        if (!params.variantId) {
            return new NextResponse("variant is is required", { status: 400 })
        }

        const variant = await db.variant.findUnique({
            where: {
                id: params.variantId,
            },
        })

        return NextResponse.json(variant)
    } catch (error) {
        console.log('[CATEGORY_GET]', error)
        return new NextResponse('Internal server error', { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    {
        params,
    }: { params: { storeId: string; variantId: string; } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { name, option1, option2 } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!params.variantId) {
            return new NextResponse("Variant id is required", { status: 400 });
        }

        if (!option1) {
            return new NextResponse("Option1 is required", { status: 400 });
        }

        if (!option2) {
            return new NextResponse("Option2 is required", { status: 400 });
        }

        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            },
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        // Fetch the current variant to get the existing options array
        const currentVariant = await db.variant.findUnique({
            where: {
                id: params.variantId,
            },
        });

        if (!currentVariant) {
            return new NextResponse("Variant not found", { status: 404 });
        }

        // Update the variant with the existing options and the new options
        const updatedVariant = await db.variant.update({
            where: {
                id: params.variantId,
            },
            data: {
                name,
                options: [...currentVariant.options, option1, option2],
            },
        });

        return NextResponse.json(updatedVariant);
    } catch (error) {
        console.log("[VARIANT_PATCH]", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}


export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string, variantId: string } }
) {
    try {
        const { userId } = auth()

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if (!params.variantId) {
            return new NextResponse('variant id id is required', { status: 400 })
        }


        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 })
        }

        const variant = await db.variant.delete({
            where: {
                id: params.variantId,
            }
        })

        return NextResponse.json(variant)
    } catch (error) {
        console.log('[VARIANT_DELETE]', error)
        return new NextResponse('Internal server error', { status: 500 })
    }
}