import cloudinary from '@/lib/cloudinary'
import { handleApiError, response } from '@/lib/helperFunction'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const payload = await request.json()
        console.log('signature payload: ', payload)

        const { paramsToSign } = payload
        const apiSecret = process.env.CLOUDINARY_SECRET_KEY

        if (!apiSecret) {
            return response(false, 500, 'Internal server issue.')
        }

        const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            apiSecret
        )

        return NextResponse.json({
            signature,
        })
    } catch (error) {
        handleApiError(error)
    }
}
