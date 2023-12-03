import db from "@/lib/db"

export const getStocksCount = async (storeId: string) => {
    const stocksCount = await db.product.count({
        where: {
            storeId,
            isArchived: false
        },
    })

    return stocksCount
}
