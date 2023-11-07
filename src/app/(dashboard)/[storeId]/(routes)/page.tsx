import db from '@/lib/db'
import { FC } from 'react'

interface pageProps {
  params: {storeId: string}
}

const page: FC<pageProps> = async ({params}) => {
    const store = await db.store.findFirst({
        where: {
            id: params.storeId
        }
    })
  
    return <div>Active store: {store?.name}</div>
}

export default page