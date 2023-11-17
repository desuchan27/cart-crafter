import db from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server"

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } },
) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { name, option1, option2 } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 })
        }

        if (!option1) {
            return new NextResponse("Option 1 is required", { status: 400 })
        }

        if (!option2) {
            return new NextResponse("Option 2 is required", { status: 400 })
        }

        if (!params.storeId) {
            return new NextResponse("Store is required", { status: 400 })
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

        const variant = await db.variant.create({
            data: {
                name,
                options: [option1, option2],
                storeId: params.storeId,
            },
        })

        return NextResponse.json(variant)

    } catch (error) {
        console.log('[VARIANTS_POST]', error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } },
) {
    try {

        if (!params.storeId) {
            return new NextResponse("Store is required", { status: 400 })
        }

        const categories = await db.variant.findMany({
            where: {
                storeId: params.storeId
            }
        })

        return NextResponse.json(categories)

    } catch (error) {
        console.log('[VARIANTS_GET]', error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}