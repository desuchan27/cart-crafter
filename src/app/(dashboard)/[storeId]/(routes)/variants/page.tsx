import { format } from 'date-fns'
import db from '@/lib/db'
import { VariantColumn } from './components/columns'
import CategoriesClient from './components/client'

const page = async ({
  params
}: {
  params: { storeId: string }
}) => {

  const variants = await db.variant.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const formattedVariants: VariantColumn[] = variants.map((item) => ({
    id: item.id,
    name: item.name,
    options: item.options,
    createdAt: format(item.createdAt, 'MMM do, yyyy')
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoriesClient data={formattedVariants} />
      </div>
    </div>
  )
}

export default page