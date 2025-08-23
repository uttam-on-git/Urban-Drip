import { handleApiError, response } from '@/lib/helperFunction'
import { zodSchema } from '@/lib/zodSchema'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import * as argon2 from 'argon2'

export async function PUT(request: NextRequest) {
    try {
        const payload = await request.json()
        const validationSchema = zodSchema.pick({
            email: true,
            password: true,
        })

        const validatedData = validationSchema.safeParse(payload)

        if (!validatedData.success) {
            return response(
                false,
                404,
                'Invalid or missing input field.',
                validatedData.error
            )
        }

        const { email, password } = validatedData.data

        const getUser = await prisma.user.findUnique({
            where: {
                email: email,
                deletedAt: null,
            },
        })

        if (!getUser) {
            return response(false, 404, 'User not found.')
        }

        const hashedPassword = await argon2.hash(password)

        //update the user password
        await prisma.user.update({
            where: {
                email,
                deletedAt: null,
            },
            data: {
                password: hashedPassword,
            },
        })

        return response(true, 200, 'Password update success')
    } catch (error) {
        handleApiError(error)
    }
}
