import db from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"


export async function GET(
    req: Request,
    { params }: { params: { productTypeId: string } }
) {
    try {
        const type = await db.productType.findUnique({
            where: {
                id: params.productTypeId,
            }
        })

        return NextResponse.json(type)
    } catch (error) {
        console.log('[STORE_GET]', error)
        return new NextResponse('Internal server error', { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, productTypeId: string } }
) {
    try {
        const { userId } = auth()
        const body = await req.json()

        const { name } = body

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if (!name) {
            return new NextResponse('Name is required', { status: 400 })
        }

        if (!params.productTypeId) {
            return new NextResponse('Product id is required', { status: 400 })
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

        const type = await db.productType.updateMany({
            where: {
                id: params.productTypeId,
            },
            data: {
                name
            }
        })
        return NextResponse.json(type)
    } catch (error) {
        console.log('[PRODUCTTYPE_PATCH]', error)
        return new NextResponse('Internal server error', { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string, productTypeId: string } }
) {
    try {
        const { userId } = auth()

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if (!params.productTypeId) {
            return new NextResponse('Type id is required', { status: 400 })
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

        const type = await db.productType.deleteMany({
            where: {
                id: params.productTypeId,
            }
        })

        return NextResponse.json(type)
    } catch (error) {
        console.log('[PRODUCTTYPE_DELETE]', error)
        return new NextResponse('Internal server error', { status: 500 })
    }
}