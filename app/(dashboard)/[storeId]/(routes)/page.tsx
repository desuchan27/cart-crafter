import { getGraphRevenue } from '@/actions/getGraphRevenue'
import { getSalesCount } from '@/actions/getSalesCount'
import { getStocksCount } from '@/actions/getStocksCount'
import { getTotalRevenue } from '@/actions/getTotalRevenue'
import Overview from '@/components/Overview'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import db from '@/lib/db'
import { formatter } from '@/lib/utils'
import { Coins, CreditCard, Currency, CurrencyIcon, Package } from 'lucide-react'
import { FC } from 'react'

interface pageProps {
    params: { storeId: string }
}

const Page: FC<pageProps> = async ({ params }) => {

    const totalRevenue = await getTotalRevenue(params.storeId)

    const salesCount = await getSalesCount(params.storeId)

    const stockCount = await getStocksCount(params.storeId)

    const graphRevenue = await getGraphRevenue(params.storeId)

    const store = await db.store.findFirst({
        where: {
            id: params.storeId
        }
    })

    return (
        <div className='flex-col'>
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Heading title='Dashboard' description="Overview of your store" />
                <Separator />
                <div className="grid gap-4 grid-cols-3">
                    <Card>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>
                                Total Revenue
                            </CardTitle>
                            <Coins className='h-4 w-4 text-muted-foreground' />
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold'>
                                {formatter.format(totalRevenue)}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>
                                Sales
                            </CardTitle>
                            <CreditCard className='h-4 w-4 text-muted-foreground' />
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold'>
                                +{salesCount}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>
                                Products in Stock
                            </CardTitle>
                            <Package className='h-4 w-4 text-muted-foreground' />
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold'>
                                {stockCount}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <Card>
                        <CardHeader>
                            <CardTitle>
                                Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Overview data={graphRevenue}/>
                        </CardContent>
                    </Card>
            </div>
        </div>
    )
}

export default Page