import { handleApiError, isAuthenticated, response } from '@/lib/helperFunction'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const auth = await isAuthenticated('ADMIN')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorised request')
        }

        const resolvedParams = await Promise.resolve(params);
        const { id } = resolvedParams;
        if (!id) {
            return response(false, 400, 'Media ID is missing.');
        }

        const getMedia = await prisma.media.findFirst({
            where: {
                id: id,
                deletedAt: null,
            },
        })

        if (!getMedia) {
            return response(false, 403, 'Media not found.')
        }

        return response(true, 201, 'Media found.', getMedia)
    } catch (error) {
        handleApiError(error)
    }
}
