import { handleApiError, isAuthenticated, response } from '@/lib/helperFunction'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
    try {
        const auth = await isAuthenticated('ADMIN')

        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized request.')
        }

        const searchParams = request.nextUrl.searchParams
        const page = parseInt(searchParams.get('page') ?? '0', 10)
        const limit = parseInt(searchParams.get('limit') ?? '10', 10) || 10
        const deleteType = searchParams.get('deleteType')

        // SD=>soft delete, RSD=> restore soft delete, PD=>permanent delete

        let filter = {}

        if (deleteType === 'SD') {
            filter = {
                deletedAt: null,
            }
        } else if (deleteType === 'PD') {
            filter = {
                deletedAt: { not: null },
            }
        }

        const [mediaData, totalMedia] = await prisma.$transaction([
            prisma.media.findMany({
                where: filter,
                orderBy: {
                    createdAt: 'desc',
                },
                skip: page * limit,
                take: limit,
            }),
            prisma.media.count({
                where: filter,
            }),
        ])

        // determine if there are more page
        const hasMore = (page + 1) * limit < totalMedia

        return NextResponse.json({
            mediaData,
            hasMore,
        })
    } catch (error) {
        handleApiError(error)
    }
}
