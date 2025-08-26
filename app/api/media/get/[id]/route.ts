import { handleApiError, isAuthenticated, response } from "@/lib/helperFunction";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest, {params}: { params: { id: string } }) {
    try {
        const auth = await isAuthenticated('ADMIN')
        if(!auth.isAuth) {
            return response(false, 403, 'Unauthorised request')
        }

        const getParams = params
        const id = getParams.id

        const getMedia = prisma.media.findFirst({
            where: {
                id: id,
                deletedAt: null
            }
        })

        if(!getMedia) {
            return response(false, 403, 'Media not found.')
        }

        return response(true, 201, 'Media found.', getMedia)
    } catch (error) {
        handleApiError(error)
    }
}