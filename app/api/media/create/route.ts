import { handleApiError, isAuthenticated, response } from '@/lib/helperFunction'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import cloudinary from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
    const payload = await request.json()
    console.log(payload)
    try {
        const auth = await isAuthenticated('ADMIN')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized request.')
        }

        if (!payload || payload.length === 0) {
            return response(false, 400, 'No media data provided.')
        }

        const newMedia = await prisma.media.createMany({
            data: payload,
        })

        return response(true, 201, 'Media upload successfully.', newMedia)
    } catch (error) {
        if (payload && payload.length > 0) {
            const publicIds = payload.map((data: { public_id: string }) => data.public_id)

            try {
                await cloudinary.api.delete_resources(publicIds)
            } catch (deleteError) {
                console.log('Rollback from cloudinary', deleteError)
            }
        }
        handleApiError(error)
    }
}
