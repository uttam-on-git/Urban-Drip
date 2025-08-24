import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface breadcrumbDataProps {
    href: string
    label: string
}

const BreadCrumb = ({
    breadcrumbData,
}: {
    breadcrumbData: breadcrumbDataProps[]
}) => {
    return (
        <Breadcrumb className='mb-5'>
            <BreadcrumbList>
                {breadcrumbData.length > 0 &&
                    breadcrumbData.map((data, index) => {
                        return index !== breadcrumbData.length - 1 ? (
                            <div key={index} className='flex items-center'>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href={data.href}>
                                        {' '}
                                        {data.label}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className='ms-2 mt-1' />
                            </div>
                        ) : (
                            <div key={index} className='flex items-center'>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href={data.href}>
                                        {' '}
                                        {data.label}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </div>
                        )
                    })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default BreadCrumb
