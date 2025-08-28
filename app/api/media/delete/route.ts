import { handleApiError, isAuthenticated, response } from '@/lib/helperFunction'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import cloudinary from '@/lib/cloudinary'

export async function PUT(request: NextRequest) {
    try {
        const auth = await isAuthenticated('ADMIN')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized request')
        }

        const payload = await request.json()

        const ids = payload.ids || []
        const deleteType = payload.deleteType

        if (!Array.isArray(ids) || ids.length === 0) {
            return response(false, 400, 'Invalid or empty id list.')
        }

        const media = await prisma?.media.findMany({
            where: {
                id: {
                    in: ids,
                },
            },
        })

        if (!media?.length) {
            return response(false, 404, 'Data not found.')
        }

        if (!['SD', 'RSD'].includes(deleteType)) {
            return response(
                false,
                400,
                'Invalid delete operation. Delete type should be SD or RSD for this route'
            )
        }

        if (deleteType === 'SD') {
            await prisma?.media.updateMany({
                where: {
                    id: {
                        in: ids,
                    },
                },
                data: {
                    deletedAt: new Date(),
                },
            })
        } else {
            await prisma?.media.updateMany({
                where: {
                    id: {
                        in: ids,
                    },
                },
                data: {
                    deletedAt: null,
                },
            })
        }

        return response(
            true,
            200,
            deleteType === 'SD' ? 'Data moved into trash.' : 'Data restored.'
        )
    } catch (error) {
        handleApiError(error)
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const auth = await isAuthenticated('ADMIN')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized request')
        }

        const payload = await request.json()

        const ids = payload.ids || []
        const deleteType = payload.deleteType

        if (!Array.isArray(ids) || ids.length === 0) {
            return response(false, 400, 'Invalid or empty id list.')
        }

        const media = await prisma.media.findMany({
            where: {
                id: {
                    in: ids,
                },
            },
        })

        if (!media?.length) {
            return response(false, 404, 'Data not found.')
        }

        if (deleteType !== 'PD') {
            return response(
                false,
                400,
                'Invalid delete operation. Delete type should be PD for this route'
            )
        }

        await prisma.$transaction(async (tx) => {
            const deleteResult = await tx.media.deleteMany({
                where: {
                    id: {
                        in: ids,
                    },
                },
            })

            if (deleteResult.count === 0) {
                throw new Error('No media found to delete.')
            }

            const publicIds = media.map((m) => m.public_id)

            //delete all matching media from cloudinary
            try {
                await cloudinary.api.delete_resources(publicIds)
            } catch (cloudinaryError) {
                console.log(cloudinaryError)
                throw new Error('Failed to delete from Cloudinary.')
            }
        })

        return response(true, 200, 'Data deleted permanentaly.')
    } catch (error) {
        handleApiError(error)
    }
}
