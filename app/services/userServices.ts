import { prisma } from '@/lib/db'
import * as argon2 from 'argon2'
import { generateOtp, response } from '@/lib/helperFunction'
import { emailVerificationLink } from '@/email/emailVerificationLink'
import { sendMail } from '@/lib/sendMail'
import { SignJWT } from 'jose'
import { otpEmail } from '@/email/otpEmail'

interface RegisterInput {
    name: string
    email: string
    password: string
}

export async function registerUser(input: RegisterInput) {
    //check if user exist or not
    const existingUser = await prisma.user.findUnique({
        where: {
            email: input.email,
        },
    })

    if (existingUser) {
        throw new Error('User with this email already exists.')
    }

    //hash the password
    const hashedPassword = await argon2.hash(input.password)

    //create the new user
    const newUser = await prisma.user.create({
        data: {
            name: input.name,
            email: input.email,
            password: hashedPassword,
        },
    })

    return newUser
}

interface LoginInput {
    email: string
    password: string
}

export async function loginUser(input: LoginInput) {
    //get user
    const getUser = await prisma.user.findUnique({
        where: {
            deletedAt: null,
            email: input.email,
        },
    })

    if (!getUser) {
        return response(false, 404, 'Invalid login credential')
    }

    //resend email verification link
    if (!getUser.isEmailVerified) {
        const secret = new TextEncoder().encode(process.env.SECRET_KEY)
        const alg = 'HS256'

        const token = await new SignJWT({ userId: getUser.id })
            .setProtectedHeader({ alg })
            .setIssuedAt()
            .setExpirationTime('2h')
            .sign(secret)

        const emailResult = await sendMail({
            to: getUser.email,
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
            false,
            400,
            'Your email is not verified. We have sent a verification link to your registerd email address.'
        )
    }

    //verify the password
    const isPasswordVerified = await argon2.verify(
        getUser.password,
        input.password
    )

    if (!isPasswordVerified) {
        return response(false, 400, 'Invalid login credentials.')
    }

    await prisma.oTP.deleteMany({
        where: {
            email: getUser.email,
        },
    })

    //new otp generation
    const newOtp = generateOtp()

    //store the otp with 10min expiry
    await prisma.oTP.create({
        data: {
            email: getUser.email,
            otp: newOtp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
    })

    //send the otp
    const emailResult = await sendMail({
        to: getUser.email,
        subject: 'Your Login Verification Code',
        body: otpEmail(newOtp),
    })

    if (!emailResult.success) {
        throw new Error('Server was unable to send OTP email.')
    }

    return response(
        true,
        200,
        'OTP has been sent to your email successfully.Please verify your device.'
    )
}
