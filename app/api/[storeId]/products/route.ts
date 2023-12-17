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

        const {
            name,
            price,
            categoryId,
            subcategoryId,
            images,
            isFeatured,
            isArchived,
        } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 })
        }

        if (!price) {
            return new NextResponse("Price is required", { status: 400 })
        }

        if (!categoryId) {
            return new NextResponse("Category is required", { status: 400 })
        }

        if (!subcategoryId) {
            return new NextResponse("Subcategory is required", { status: 400 })
        }

        if (!images || !images.length) {
            return new NextResponse("Images are required", { status: 400 })
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

        const product = await db.product.create({
            data: {
                name,
                price,
                categoryId,
                subcategoryId,
                isFeatured,
                isArchived,
                storeId: params.storeId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image)
                        ]
                    }
                },
            }
        })

        return NextResponse.json(product)

    } catch (error) {
        console.log('[PRODUCTS_POST]', error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } },
) {
    try {

        const { searchParams } = new URL(req.url)
        const categoryId = searchParams.get('categoryId') || undefined
        const subcategoryId = searchParams.get('subcategoryId') || undefined
        const isFeatured = searchParams.get('isFeatured') || undefined

        if (!params.storeId) {
            return new NextResponse("Store is required", { status: 400 })
        }

        const products = await db.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                subcategoryId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false,
            },
            include: {
                images: true,
                category: true,
                subcategory: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(products)

    } catch (error) {
        console.log('[PRODUCTS_GET]', error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}