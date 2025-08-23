import { handleApiError, response } from '@/lib/helperFunction'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        cookieStore.delete('access_token')

        return response(true, 200, 'Logout successfully.')
    } catch (error) {
        handleApiError(error)
    }
}
