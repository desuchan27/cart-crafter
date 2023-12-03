"use client"

import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { FC } from 'react'
import { OrderColumn, columns } from './columns'
import { DataTable } from '@/components/ui/data-table'

interface OrderClientProps {
    data: OrderColumn[]
}

const OrderClient: FC<OrderClientProps> = ({
    data
 }) => {

    const router = useRouter()
    const params = useParams()

    

    return (
        <>
            <div className='flex items-center justify-between'>
                <Heading 
                    title={`Orders (${data.length})`}
                    description='Manage orders for your store'
                />
                <Button onClick={() => router.push(`/${params.storeId}/orders/new`)}>
                    <Plus className='mr-2 h-4 w-4' />
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey="label" />
        </>
    )
}

export default OrderClient