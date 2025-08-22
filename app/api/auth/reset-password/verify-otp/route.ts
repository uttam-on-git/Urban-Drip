import { handleApiError, response } from '@/lib/helperFunction'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { zodSchema } from '@/lib/zodSchema'

export async function POST(request: NextRequest) {
    try {
        const payload = await request.json()

        const validationSchema = zodSchema.pick({
            email: true,
            otp: true,
        })

        const validatedData = validationSchema.safeParse(payload)

        if (!validatedData.success) {
            return response(false, 401, 'Invalid or missing input field')
        }

        const { email, otp } = validatedData.data

        const getOtp = await prisma.oTP.findFirst({
            where: {
                email: email,
                otp: otp,
            },
        })

        if (!getOtp) {
            return response(false, 404, 'Invalide or expired otp.')
        }

        const getUser = await prisma.user.findFirst({
            where: {
                deletedAt: null,
                email: email,
            },
        })

        if (!getUser) {
            return response(false, 404, 'User not found.')
        }

        //remove otp after validation

        await prisma.oTP.delete({
            where: {
                id: getOtp.id,
            },
        })

        return response(true, 200, 'OTP verified.')
    } catch (error) {
        handleApiError(error)
    }
}
