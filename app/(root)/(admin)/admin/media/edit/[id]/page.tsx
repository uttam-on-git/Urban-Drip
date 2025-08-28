'use client'

import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import ButtonLoading from '@/components/Application/ButtonLoading'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import useFetch from '@/hooks/useFetch'
import { zodSchema } from '@/lib/zodSchema'
import {
    ADMIN_DASHBOARD,
    ADMIN_MEDIA_SHOW,
} from '@/routes/AdminPanelRoutes'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import Image from 'next/image'
import { use, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import imagePlaceHolder from "@/public/assets/images/img-placeholder.webp"
import { showToast } from '@/lib/showToast'

interface ParamsProps {
    params: Promise<{ id: string }>
}

export interface MediaData {
    success:    boolean;
    statusCode: number;
    message:    string;
    data:       Data;
}

export interface Data {
    alt:           null | string;
    asset_id:      string;
    createdAt:     Date;
    deletedAt:     null;
    id:            string;
    path:          string;
    public_id:     string;
    secure_url:    string;
    thumbnail_url: string;
    title:         null | string;
    updatedAt:     Date;
}

const breadCrumbData = [
    {
        href: ADMIN_DASHBOARD,
        label: 'Home',
    },
    {
        href: ADMIN_MEDIA_SHOW,
        label: 'Media',
    },
    {
        href: '',
        label: 'Edit Media',
    },
]

const MediaEdit = ({ params }: ParamsProps) => {
    const { id } = use(params)

    const [loading, setLoading] = useState(false)
    const { data: mediaData } = useFetch<MediaData>(`/api/media/get/${id}`)

    const formSchema = zodSchema.pick({
        id: true,
        alt: true,
        title: true,
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: '',
            alt: '',
            title: '',
        },
    })

    useEffect(() => {
        if(mediaData && mediaData.success) {
            const data = mediaData.data
            form.reset({
                id: data.id,
                alt: data.alt ?? '',
                title: data.title ?? '' 
            })
        }
    }, [form, mediaData])

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
            try {
                setLoading(true)
                const { data: response } = await axios.put(
                    '/api/media/update',
                    values
                )
                if (!response.success) {
                    throw new Error(response.message)
                }
                showToast('success', response.message)
            } catch (error) {
                if (error instanceof Error) {
                    showToast('error', error.message)
                } else {
                    showToast('error', 'An unexpected error occurred')
                }
            } finally {
                setLoading(false)
            }
    }

    return (
        <div>
            <BreadCrumb breadcrumbData={breadCrumbData}></BreadCrumb>
            <Card className='rounded py-0 shadow-sm'>
                <CardHeader className='border-b px-3 py-2'>
                    <h4 className='text-xl font-semibold'>Edit Media</h4>
                </CardHeader>
                <CardContent className='pb-5'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className='mb-5'>
                                <Image
                                    src={mediaData?.data?.secure_url || imagePlaceHolder}
                                    alt={mediaData?.data?.alt || 'Image'}
                                    width={150}
                                    height={150}
                                ></Image>
                            </div>
                            <div className='mb-5'>
                                <FormField
                                    control={form.control}
                                    name='title'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='title'
                                                    placeholder='Enter title.'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className='mb-5'>
                                <FormField
                                    control={form.control}
                                    name='alt'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Alt</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='alt'
                                                    placeholder='Enter your alt'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='mb-3'>
                                <ButtonLoading
                                    type='submit'
                                    className='cursor-pointer dark:text-white'
                                    text='Update Media'
                                    loading={loading}
                                />
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default MediaEdit