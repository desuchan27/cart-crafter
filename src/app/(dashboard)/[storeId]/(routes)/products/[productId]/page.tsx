import db from '@/lib/db'
import ProductForm from './components/ProductForm'


const page = async ({
    params   
}: {
    params: {productId: string, storeId: string}
}) => {

    const product = await db.product.findUnique({
        where: {
            id: params.productId
        },
        include: {
            images: true
        }
    })

    const categories = await db.category.findMany({
        where: {
            storeId: params.storeId
        }
    })

    const variants = await db.variant.findMany({
        where: {
            storeId: params.storeId
        },
    })
  return (
    <div className='flex-col'>
        <div className="flex-1 space-y-4 p-8 pt-6">
            <ProductForm 
                initialData={product}
                categories={categories}
                variants={variants}
            />
        </div>
    </div>
  )
}

export default page