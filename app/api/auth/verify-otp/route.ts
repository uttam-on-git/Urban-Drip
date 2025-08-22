import { response } from '@/lib/helperFunction'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { zodSchema } from '@/lib/zodSchema';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        const payload = await request.json();

        const validationSchema = zodSchema.pick({
            email: true, otp: true
        })

        const validatedData = validationSchema.safeParse(payload);

        if(!validatedData.success) {
            return response(false, 401, "Invalid or missing input field")
        }

        const { email, otp} = validatedData.data

        const getOtp = await prisma.oTP.findFirst({
            where: {
                email: email,
                otp: otp
            }
        })

        if(!getOtp) {
            return response(false, 404, "Invalide or expired otp.")
        }

        const getUser = await prisma.user.findFirst({
            where: {
                deletedAt: null,
                email: email
            }
        })

        if(!getUser) {
            return response(false, 404, "User not found.")
        }

        const loggedInUserData = {
            id: getUser.id,
            role: getUser.role,
            name: getUser.name,
            avatar: getUser.avatarUrl
        }

        const alg = "HS256"

        const secret = new TextEncoder().encode(process.env.SECRET_KEY)
        const token = await new SignJWT(loggedInUserData)
            .setProtectedHeader({ alg })
            .setIssuedAt()
            .setExpirationTime('24h')
            .sign(secret)
        
        const cookieStore = await cookies()

        cookieStore.set({
            name: 'access_token',
            value: token,
            httpOnly: process.env.NODE_ENV === "production",
            path: '/',
            secure: process.env.NODE_ENV === "production",
            sameSite: 'lax'
        })

        //remove otp after validation

        await prisma.oTP.delete({
            where: {
                id: getOtp.id
            }
        })

        return response(true, 200, 'Login successfully.', loggedInUserData)
    } catch (error) {
        console.error('Verification Error:', error)
        return response(false, 500, 'An internal server error occurred.')
    }
}
