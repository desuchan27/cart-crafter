import db from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"


export async function GET(
    req: Request,
    { params }: { params: { subcategoryId: string } }
) {
    try {

        if (!params.subcategoryId) {
            return new NextResponse("Category is is required", { status: 400 })
        }

        const subcategory = await db.subcategory.findUnique({
            where: {
                id: params.subcategoryId,
            },
            include: {
                billboard: true,
                category: true,
            }
        })

        return NextResponse.json(subcategory)
    } catch (error) {
        console.log('[SUBCATEGORY_GET]', error)
        return new NextResponse('Internal server error', { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, subcategoryId: string } }
) {
    try {
        const { userId } = auth()
        const body = await req.json()

        const { name, categoryId, billboardId } = body

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if (!name) {
            return new NextResponse('Name is required', { status: 400 })
        }

        if (!categoryId) {
            return new NextResponse('Category id is required', { status: 400 })
        }

        if (!billboardId) {
            return new NextResponse('billboardId is required', { status: 400 })
        }

        if (!params.subcategoryId) {
            return new NextResponse('Category id is required', { status: 400 })
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

        const subcategory = await db.subcategory.update({
            where: {
                id: params.subcategoryId,
            },
            data: {
                name,
                categoryId,
                billboardId
            }
        })
        return NextResponse.json(subcategory)
    } catch (error) {
        console.log('[SUBCATEGORY_PATCH]', error)
        return new NextResponse('Internal server error', { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string, subcategoryId: string } }
) {
    try {
        const { userId } = auth()

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if (!params.subcategoryId) {
            return new NextResponse('Category id id is required', { status: 400 })
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

        const subcategory = await db.subcategory.delete({
            where: {
                id: params.subcategoryId,
            }
        })

        return NextResponse.json(subcategory)
    } catch (error) {
        console.log('[SUBCATEGORY_DELETE]', error)
        return new NextResponse('Internal server error', { status: 500 })
    }
}