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

        const { name } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if (!name) {
            return new NextResponse("Label is required", { status: 400 })
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

        const billboard = await db.productType.create({
            data: {
                name,
                storeId: params.storeId
            }
        })

        return NextResponse.json(billboard)

    } catch (error) {
        console.log('[PRODUCTTYPES_POST]', error)
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

        const types = await db.productType.findMany({
            where: {
                storeId: params.storeId
            }
        })

        return NextResponse.json(types)

    } catch (error) {
        console.log('[PRODUCTTYPES_GET]', error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}