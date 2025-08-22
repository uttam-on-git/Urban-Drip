import { registerUser } from '@/app/services/userServices'
import { handleApiError, response } from '@/lib/helperFunction'
import { zodSchema } from '@/lib/zodSchema'
import { NextRequest } from 'next/server'
import { SignJWT } from 'jose'
import { sendMail } from '@/lib/sendMail'
import { emailVerificationLink } from '@/email/emailVerificationLink'

export async function POST(request: NextRequest) {
    try {
        const validationSchema = zodSchema.pick({
            name: true,
            email: true,
            password: true,
        })

        const payload = await request.json()

        const validatedData = validationSchema.safeParse(payload)

        if (!validatedData.success) {
            return response(
                false,
                401,
                'Invalid or missing some required input',
                validatedData.error
            )
        }
        //call the register service to handle the registration
        const newUser = await registerUser(validatedData.data)

        const secret = new TextEncoder().encode(process.env.SECRET_KEY)
        const alg = 'HS256'

        const token = await new SignJWT({ userId: newUser.id })
            .setProtectedHeader({ alg })
            .setIssuedAt()
            .setExpirationTime('2h')
            .sign(secret)

        const emailResult = await sendMail({
            to: newUser.email,
            subject: 'Email verification request from Urban-Drip',
            body: emailVerificationLink(
                `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`
            ),
        })

        if (!emailResult.success) {
            console.error(
                'Failed to send verification email:',
                emailResult.message
            )

            throw new Error('Server was unable to send verification email.')
        }

        return response(
            true,
            200,
            'Registration success, please verify your email address.'
        )
    } catch (error) {
        console.error('[API REGISTRATION ERROR]:', error)
        return handleApiError(error)
    }
}
