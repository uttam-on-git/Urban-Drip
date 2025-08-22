import { response } from '@/lib/helperFunction'
import { jwtVerify } from 'jose'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
    try {
        const { token } = await request.json()
        if (!token) {
            return response(false, 400, 'Missing token.')
        }

        const secret = new TextEncoder().encode(process.env.SECRET_KEY)
        const { payload } = await jwtVerify(token, secret)

        const userId = payload.userId as string

        //get user
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        })

        if (!user) {
            return response(false, 404, 'User not found;')
        }

        //check if email already verified
        if (user.isEmailVerified) {
            return response(true, 200, 'Email is already verified.')
        }

        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                isEmailVerified: true,
            },
        })
        return response(true, 200, 'Email verified successfully.')
    } catch (error) {
        if (error instanceof Error && error.name === 'JWTExpired') {
            return response(false, 400, 'Verification link has expired.')
        }

        console.error('Verification Error:', error)
        return response(false, 500, 'An internal server error occurred.')
    }
}
