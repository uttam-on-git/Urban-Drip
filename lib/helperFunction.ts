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
    console.error('API Error:', error)

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
