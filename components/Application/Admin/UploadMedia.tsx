/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Button } from '@/components/ui/button'
import { showToast } from '@/lib/showToast'
import {useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { CldUploadWidget } from 'next-cloudinary'
import type { CloudinaryUploadWidgetError } from 'next-cloudinary'
import { FiPlus } from 'react-icons/fi'

const UploadMedia = ({ isMultiple}: { isMultiple?: boolean, }) => {
    const queryClient = useQueryClient()
    const handleOnError = (error: CloudinaryUploadWidgetError) => {
        if (!error) {
            showToast('error', 'An unknown error occurred')
            return
        }
        if (typeof error === 'string') {
            showToast('error', error)
            return
        }
        showToast('error', error.statusText)
    }

    const handleOnQueuesEnd = async (result: {
        event?: string
        info?: any
    }) => {
        if (result.event === 'queues-end' && result.info && result.info.files) {
            const filesArray = result.info.files

            const uploadedFiles = filesArray.map((file: any) => ({
                asset_id: file.uploadInfo.asset_id,
                public_id: file.uploadInfo.public_id,
                secure_url: file.uploadInfo.secure_url,
                path: file.uploadInfo.path,
                thumbnail_url: file.uploadInfo.thumbnail_url,
            }))

            if (uploadedFiles.length > 0) {
                try {
                    const { data: mediaUploadResponse } = await axios.post(
                        '/api/media/create',
                        uploadedFiles
                    )

                    if (!mediaUploadResponse.success) {
                        throw new Error(mediaUploadResponse.error)
                    }

                    queryClient.invalidateQueries({ queryKey: ['media-data']})
                    showToast('success', mediaUploadResponse.message)
                } catch (error) {
                    showToast(
                        'error',
                        (error as Error).message || 'Unknown error.'
                    )
                }
            }
        }
    }

    return (
        <CldUploadWidget
            signatureEndpoint='/api/auth/cloudinary-signature'
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            onError={handleOnError}
            onQueuesEnd={handleOnQueuesEnd}
            options={{
                cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
                multiple: isMultiple,
                sources: ['local', 'url', 'google_drive', 'unsplash'],
            }}
        >
            {({ open }) => {
                return (
                    <Button onClick={() => open()} className='cursor-pointer dark:text-white'>
                        <FiPlus />
                        Upload Files
                    </Button>
                )
            }}
        </CldUploadWidget>
    )
}

export default UploadMedia
