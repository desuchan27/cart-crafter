import db from '@/lib/db'
import TypeForm from './components/TypeForm'

const page = async ({
    params   
}: {
    params: {productTypeId: string}
}) => {

    const type = await db.productType.findUnique({
        where: {
            id: params.productTypeId
        }
    })

  return (
    <div className='flex-col'>
        <div className="flex-1 space-y-4 p-8 pt-6">
            <TypeForm initialData={type}/>
        </div>
    </div>
  )
}

export default page