import { format } from 'date-fns'
import { formatter } from '@/lib/utils'
import ProductClient from './components/client'
import db from '@/lib/db'
import { ProductColumn } from './components/columns'

const page = async ({
  params
}: {
  params: { storeId: string }
}) => {

  const products = await db.product.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      category: true,
      variant: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    category: item.category.name,
    variant: item.variant.name,
    price: formatter.format(item.price.toNumber()),

    createdAt: format(new Date(item.createdAt), 'MMM do, yyyy')
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  )
}

export default page