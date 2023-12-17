import { format } from 'date-fns'
import BillboardClient from './components/client'
import db from '@/lib/db'
import { TypeColumn } from './components/columns'

const page = async ({
  params
}: {
  params: { storeId: string }
}) => {

  const type = await db.productType.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const formattedTypes: TypeColumn[] = type.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: format(new Date(item.createdAt), 'MMM do, yyyy')
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedTypes} />
      </div>
    </div>
  )
}

export default page