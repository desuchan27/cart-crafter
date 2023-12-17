import { format } from 'date-fns'
import db from '@/lib/db'
import { SubcategoryColumn } from './components/columns'
import SubcategoriesClient from './components/client'

const page = async ({
  params
}: {
  params: { storeId: string }
}) => {

  const subcategories = await db.subcategory.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      category: true,
      billboard: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const formattedSubcategories: SubcategoryColumn[] = subcategories.map((item) => ({
    id: item.id,
    name: item.name,
    categoryName: item.category.name,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt, 'MMM do, yyyy')
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SubcategoriesClient data={formattedSubcategories} />
      </div>
    </div>
  )
}

export default page