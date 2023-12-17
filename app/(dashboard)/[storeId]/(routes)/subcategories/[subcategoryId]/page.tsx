import db from '@/lib/db'
import SubategoryForm from './components/SubcategoryForm'

const page = async ({
    params   
}: {
    params: { subcategoryId: string, categoryId: string, storeId: string}
}) => {

    const subcategory = await db.subcategory.findUnique({
        where: {
            id: params.subcategoryId
        }
    })

    const categories = await db.category.findMany({
        where: {
            id: params.categoryId
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
            <SubategoryForm 
                billboards={billboards}
                categories={categories}
                initialData={subcategory}
            />
        </div>
    </div>
  )
}

export default page