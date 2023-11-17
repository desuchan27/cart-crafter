import db from '@/lib/db'
import VariantForm from './components/VariantForm'

const page = async ({
    params   
}: {
    params: {variantId: string, storeId: string}
}) => {

    const variant = await db.variant.findUnique({
        where: {
            id: params.variantId
        }
    })

    const billboards = await db.billboard.findMany({
        where: {
            storeId: params.storeId
        }
    })
  return (
    <div className='flex-col'>
        <div className="flex-1 space-y-4 p-8 pt-6">
            <VariantForm 
                initialData={variant}
            />
        </div>
    </div>
  )
}

export default page