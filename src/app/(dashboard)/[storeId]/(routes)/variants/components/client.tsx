"use client"

import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { FC } from 'react'
import { VariantColumn, columns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import ApiList from '@/components/ui/apiList'

interface CategoriesClientProps {
    data: VariantColumn[]
}

const CategoriesClient: FC<CategoriesClientProps> = ({
    data
 }) => {

    const router = useRouter()
    const params = useParams()

    

    return (
        <>
            <div className='flex items-center justify-between'>
                <Heading 
                    title={`Variants (${data.length})`}
                    description='Manage variants for your store'
                />
                <Button onClick={() => router.push(`/${params.storeId}/variants/new`)}>
                    <Plus className='mr-2 h-4 w-4' />
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey="name" />
            <Heading title='API' description='API calls for variants' />
            <Separator />
            <ApiList entityName='variants' entityIdName='variantId'/>
        </>
    )
}

export default CategoriesClient