import db from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"


export async function GET(
    req: Request,
    { params }: { params: { categoryId: string } }
) {
    try {

        if (!params.categoryId) {
            return new NextResponse("Category is is required", { status: 400 })
        }

        const category = await db.category.findUnique({
            where: {
                id: params.categoryId,
            },
            include: {
                billboard: true,
            }
        })

        return NextResponse.json(category)
    } catch (error) {
        console.log('[CATEGORY_GET]', error)
        return new NextResponse('Internal server error', { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, categoryId: string } }
) {
    try {
        const { userId } = auth()
        const body = await req.json()

        const { name, billboardId } = body

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if (!name) {
            return new NextResponse('Name is required', { status: 400 })
        }

        if (!billboardId) {
            return new NextResponse('billboardId is required', { status: 400 })
        }

        if (!params.categoryId) {
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

        const category = await db.category.update({
            where: {
                id: params.categoryId,
            },
            data: {
                name,
                billboardId
            }
        })
        return NextResponse.json(category)
    } catch (error) {
        console.log('[CATEGORY_PATCH]', error)
        return new NextResponse('Internal server error', { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string, categoryId: string } }
) {
    try {
        const { userId } = auth()

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if (!params.categoryId) {
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

        const category = await db.category.delete({
            where: {
                id: params.categoryId,
            }
        })

        return NextResponse.json(category)
    } catch (error) {
        console.log('[CATEGORY_DELETE]', error)
        return new NextResponse('Internal server error', { status: 500 })
    }
}