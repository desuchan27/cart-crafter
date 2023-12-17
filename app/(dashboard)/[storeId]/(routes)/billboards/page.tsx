import { format } from 'date-fns'
import BillboardClient from './components/client'
import db from '@/lib/db'
import { Billboardcolumn } from './components/columns'

const page = async ({
  params
}: {
  params: { storeId: string }
}) => {

  const billboards = await db.billboard.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const formattedBillboards: Billboardcolumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(new Date(item.createdAt), 'MMM do, yyyy')
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  )
}

export default page