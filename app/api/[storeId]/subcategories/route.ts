import db from "@/lib/db";
import { auth } from "@clerk/nextjs";
import next from "next";
import { NextResponse } from "next/server"

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } },
) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { name, billboardId, categoryId } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 })
        }

        if (!categoryId) {
            return new NextResponse("Category id is required", { status: 400 })
        }

        if (!billboardId) {
            return new NextResponse("Billboard id is required", { status: 400 })
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

        const subcategory = await db.subcategory.create({
            data: {
                name,
                billboardId,
                categoryId,
                storeId: params.storeId
            }
        })

        return NextResponse.json(subcategory)

    } catch (error) {
        console.log('[SUBCATEGORIES_POST]', error)
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

        const subcategories = await db.subcategory.findMany({
            where: {
                storeId: params.storeId
            }, include: {
                billboard: true,
            }
        })

        return NextResponse.json(subcategories)

    } catch (error) {
        console.log('[SUBCATEGORIES_GET]', error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}