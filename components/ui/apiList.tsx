import { useOrigin } from 'hooks/useOrigin'
import { useParams } from 'next/navigation'
import { FC } from 'react'
import ApiAlert from './apiAlert'

interface ApiListProps {
    entityName: string
    entityIdName: string
}

const ApiList: FC<ApiListProps> = ({
    entityName,
    entityIdName,
}) => {
    const params = useParams()
    const origin = useOrigin()

    const baseUrl = `${origin}/api/${params.storeId}`

    return (
        <>
            <ApiAlert
                title='GET'
                variant='public'
                description={`${baseUrl}/${entityName}`}
            />
            <ApiAlert
                title='GET'
                variant='public'
                description={`${baseUrl}/${entityName}/{${entityIdName}}`}
            />
            <ApiAlert
                title='POST'
                variant='admin'
                description={`${baseUrl}/${entityName}`}
            />
            <ApiAlert
                title='PATCH'
                variant='admin'
                description={`${baseUrl}/${entityName}/{${entityIdName}}`}
            />
            <ApiAlert
                title='DELETE'
                variant='admin'
                description={`${baseUrl}/${entityName}/{${entityIdName}}`}
            />
        </>
        
    )
}

export default ApiList