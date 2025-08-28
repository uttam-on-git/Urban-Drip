import { generateOtp, handleApiError, response } from '@/lib/helperFunction'
import { zodSchema } from '@/lib/zodSchema'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { sendMail } from '@/lib/sendMail'
import { otpEmail } from '@/email/otpEmail'

export async function POST(request: NextRequest) {
    try {
        const payload = await request.json()
        const validationSchema = zodSchema.pick({
            email: true,
        })

        const validatedData = validationSchema.safeParse(payload)

        if (!validatedData.success) {
            return response(
                false,
                401,
                'Invalid or missing input field.',
                validatedData.error
            )
        }

        const { email } = validatedData.data

        const getUser = await prisma.user.findUnique({
            where: {
                email: email,
            },
        })

        if (!getUser) {
            return response(false, 404, 'User not found')
        }

        //delete old otp
        await prisma.oTP.deleteMany({
            where: {
                email: validatedData.data.email,
            },
        })

        const TEN_MINUTES_IN_MS = 10 * 60 * 1000
        const expiresAt = new Date(Date.now() + TEN_MINUTES_IN_MS)

        const otp = generateOtp()
        const newOtpData = await prisma.oTP.create({
            data: {
                email: validatedData.data.email,
                otp: otp,
                expiresAt: expiresAt,
            },
        })

        const otpSendStatus = await sendMail({
            to: newOtpData.email,
            subject: 'Your New Verification Code',
            body: otpEmail(otp),
        })

        if (!otpSendStatus.success) {
            return response(false, 500, 'Failed to resend OTP.', {
                error: otpSendStatus.message,
            })
        }

        return response(true, 200, 'Please verify your account.')
    } catch (error) {
        handleApiError(error)
    }
}
