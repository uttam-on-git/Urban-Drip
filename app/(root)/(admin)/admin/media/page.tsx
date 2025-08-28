'use client'

import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import Media from '@/components/Application/Admin/Media'
import UploadMedia from '@/components/Application/Admin/UploadMedia'
import ButtonLoading from '@/components/Application/ButtonLoading'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import useDeleteMutation from '@/hooks/useDeleteMutation'
import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from '@/routes/AdminPanelRoutes'
import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const breadcrumbData = [
    {
        href: ADMIN_DASHBOARD,
        label: 'Home',
    },
    {
        href: '',
        label: 'Media',
    },
]

interface MediaResponseType {
    mediaData: MediaType[]
    hasMore: boolean
}

interface MediaType {
    id: string
    asset_id: string
    public_id: string
    path: string
    secure_url: string
    thumbnail_url: string
    alt: null
    title: null
    deletedAt: null
    createdAt: Date
    updatedAt: Date
}

const MediaPage = () => {
    const [deleteType, setDeleteType] = useState('SD')
    const [selectedMedia, setSelectedMedia] = useState<string[]>([])
    const [selectAll, setSelectAll] = useState<boolean>(false)

    const deleteMutation = useDeleteMutation(
        ['media-data'],
        '/api/media/delete'
    )

    const searchParams = useSearchParams()

    useEffect(() => {
        if (searchParams) {
            const trashof = searchParams.get('trashof')
            setSelectedMedia([])
            if (trashof) {
                setDeleteType('PD')
            } else {
                setDeleteType('SD')
            }
        }
    }, [searchParams])

    const fetchMedia = async (
        page: number,
        deleteType: string
    ): Promise<MediaResponseType> => {
        const { data: response } = await axios.get(
            `/api/media?page=${page}&&limit=10&&deleteType=${deleteType}`
        )
        return response
    }

    const { data, error, status, hasNextPage, fetchNextPage, isFetching } =
        useInfiniteQuery({
            queryKey: ['media-data', deleteType],
            queryFn: async ({ pageParam }) =>
                await fetchMedia(pageParam, deleteType),
            initialPageParam: 0,
            getNextPageParam: (lastPage, pages) => {
                const nextPage = pages.length

                return lastPage.hasMore ? nextPage : null
            },
        })

    const handleDelete = (selectedMedia: string[], deleteType: string) => {
        let c = true
        if (deleteType === 'PD') {
            c = confirm('Are you sure you want to delete the data permanently?')
        }
        if (c) {
            deleteMutation.mutate({ ids: selectedMedia, deleteType })
        }

        setSelectAll(false)
        setSelectedMedia([])
    }

    const handleSelectAll = () => {
        setSelectAll(!selectAll)
    }

    useEffect(() => {
        if (selectAll) {
            const ids = data?.pages.flatMap((page) =>
                page.mediaData.map((media) => media.id)
            )
            setSelectedMedia(ids ?? [])
        } else {
            setSelectedMedia([])
        }
    }, [selectAll, data])
    return (
        <div>
            <BreadCrumb breadcrumbData={breadcrumbData} />
            <Card className='rounded py-0 shadow-sm'>
                <CardHeader className='border-b px-3 py-2'>
                    <div className='flex items-center justify-between'>
                        <h4 className='text-xl font-semibold uppercase'>
                            {deleteType === 'SD' ? 'Media' : 'Media Trash'}
                        </h4>
                        <div className='flex items-center gap-5'>
                            {deleteType === 'SD' && (
                                <UploadMedia isMultiple={true} />
                            )}
                            <div className='flex gap-3'>
                                {deleteType === 'SD' ? (
                                    <Button
                                        type='button'
                                        variant='destructive'
                                        className='dark:bg-red-500'
                                    >
                                        <Link
                                            href={`${ADMIN_MEDIA_SHOW}?trashof=media`}
                                        >
                                            Trash
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button
                                        type='button'
                                        className='cursor-pointer dark:text-white'
                                    >
                                        <Link href={`${ADMIN_MEDIA_SHOW}`}>
                                            Back To Media
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className='pb-5'>
                    {selectedMedia.length > 0 && (
                        <div className='border-primary mb-2 flex items-center justify-between rounded px-3 py-2'>
                            <Label>
                                <Checkbox
                                    checked={selectAll}
                                    onCheckedChange={handleSelectAll}
                                    className='border-primary z-56'
                                />
                                Select All
                            </Label>

                            <div className='flex gap-2'>
                                {deleteType === 'SD' ? (
                                    <Button
                                        type='button'
                                        variant='destructive'
                                        className='cursor-pointer dark:bg-red-500'
                                        onClick={() =>
                                            handleDelete(
                                                selectedMedia,
                                                deleteType
                                            )
                                        }
                                    >
                                        Move Into Trash
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            className='bg-green-700 hover:bg-green-900'
                                            type='button'
                                            onClick={() =>
                                                handleDelete(
                                                    selectedMedia,
                                                    'RSD'
                                                )
                                            }
                                        >
                                            Restore
                                        </Button>
                                        <Button
                                            type='button'
                                            onClick={() =>
                                                handleDelete(
                                                    selectedMedia,
                                                    'RSD'
                                                )
                                            }
                                        >
                                            Delete Permanently
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                    {status === 'pending' ? (
                        <div>loading...</div>
                    ) : status === 'error' ? (
                        <div className='text-sm text-red-500'>
                            {error.message}
                        </div>
                    ) : (
                        <>
                            {data?.pages.flatMap((page) =>
                                (page.mediaData || []).map((media) => media.id)
                            ).length === 0 && (
                                <div className='text-center text-red-500'>
                                    Data not found.
                                </div>
                            )}
                            <div className='mb-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5'>
                                {data?.pages?.map((page, index) => (
                                    <React.Fragment key={index}>
                                        {page?.mediaData?.map((media) => (
                                            <Media
                                                key={media.id}
                                                media={media}
                                                handleDelete={handleDelete}
                                                deleteType={deleteType}
                                                selectedMedia={selectedMedia}
                                                setSelectedMedia={
                                                    setSelectedMedia
                                                }
                                            />
                                        ))}
                                    </React.Fragment>
                                ))}
                            </div>
                        </>
                    )}
                    {hasNextPage && (
                        <ButtonLoading
                            type='button'
                            className='cursor-pointer dark:text-white'
                            loading={isFetching}
                            onClick={() => fetchNextPage()}
                            text='Load more'
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default MediaPage
