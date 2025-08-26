import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const response = (
    success: boolean,
    statusCode: number,
    message: string,
    data: object = {}
) => {
    return NextResponse.json({
        success,
        statusCode,
        message,
        data,
    })
}

export const handleApiError = (error: unknown) => {

    let message = 'An internal server error occurred.'
    const statusCode = 500
    if (error instanceof Error) {
        message = error.message
    }

    // For development, include the full error in the response data for easier debugging
    const errorData = process.env.NODE_ENV === 'development' ? { error } : {}

    return response(false, statusCode, message, errorData)
}

export const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    return otp
}

export const isAuthenticated = async (role: string) => {
    try {
        const cookieStore = await cookies()
        if (!cookieStore.has('access_token')) {
            return {
                isAuth: false,
            }
        }

        const access_token = cookieStore.get('access_token')

        if (!access_token) {
            return { isAuth: false }
        }

        const { payload } = await jwtVerify(
            access_token.value,
            new TextEncoder().encode(process.env.SECRET_KEY)
        )
        if (payload.role !== role) {
            return { isAuth: false }
        }

        return {
            isAuth: true,
            userId: payload.id,
        }
    } catch (error) {
        return {
            isAuth: false,
            error: (error as Error).message || 'Unknown error',
        }
    }
}
