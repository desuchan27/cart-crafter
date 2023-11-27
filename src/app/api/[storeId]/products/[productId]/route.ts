import db from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"


export async function GET(
    req: Request,
    { params }: { params: { productId: string } }
) {
    try {
        const product = await db.product.findUnique({
            where: {
                id: params.productId,
            },
            include: {
                images: true,
                category: true,
                variant: true,
            }
        })

        return NextResponse.json(product)
    } catch (error) {
        console.log('[PRODUCT_GET]', error)
        return new NextResponse('Internal server error', { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, productId: string } }
) {
    try {
        const { userId } = auth()
        const body = await req.json()

        const {
            name,
            price,
            categoryId,
            variantId,
            images,
            isFeatured,
            isArchived,
        } = body;

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
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

        if (!variantId) {
            return new NextResponse("Variant is required", { status: 400 })
        }

        if (!images || !images.length) {
            return new NextResponse("Images are required", { status: 400 })
        }

        if (!params.productId) {
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

        await db.product.update({
            where: {
                id: params.productId,
            },
            data: {
                name,
                price,
                categoryId,
                variantId,
                isFeatured,
                isArchived,
                storeId: params.storeId,
                images: {
                    deleteMany: {}
                },
            }
        })

        const product = await db.product.update({
            where: {
                id: params.productId,
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image)
                        ]
                    }
                }
            }
        })
        return NextResponse.json(product)
    } catch (error) {
        console.log('[PRODUCT_PATCH]', error)
        return new NextResponse('Internal server error', { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string, productId: string } }
) {
    try {
        const { userId } = auth()

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if (!params.productId) {
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

        // Delete the associated images
        await db.image.deleteMany({
            where: {
                productId: params.productId,
            },
        });

        // Then delete the product
        const product = await db.product.delete({
            where: {
                id: params.productId,
            },
        });

        return NextResponse.json(product)
    } catch (error) {
        console.log('[PRODUCT_DELETE]', error)
        return new NextResponse('Internal server error', { status: 500 })
    }
}