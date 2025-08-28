import { handleApiError, isAuthenticated, response } from '@/lib/helperFunction'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { zodSchema } from '@/lib/zodSchema'

export async function PUT(request: NextRequest) {
    try {
        const auth = await isAuthenticated('ADMIN')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorised request')
        }

        const payload = await request.json()
        
        const schema = zodSchema.pick({
            id: true,
            title: true,
            alt: true,
        })

        const validate = schema.safeParse(payload)

        if(!validate.success) {
            return response(false, 400, 'Invalid or Missing field', validate.error)
        }

        const { id, alt, title } = validate.data

        const getMedia = await prisma.media.findFirst({
            where: {
                id: id
            }
        })

        if(!getMedia) {
            return response(false, 404, 'Media not found.')
        }

        getMedia.alt = alt
        getMedia.title = title

        return response(true, 200, 'Media updated successfully.')
    } catch (error) {
        handleApiError(error)
    }
}
