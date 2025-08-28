import { loginUser } from '@/app/services/userServices'
import { handleApiError, response } from '@/lib/helperFunction'
import { zodSchema } from '@/lib/zodSchema'
import { NextRequest } from 'next/server'
import z from 'zod'

export async function POST(request: NextRequest) {
    try {
        const validationSchema = zodSchema
            .pick({
                email: true,
            })
            .extend({
                password: z.string(),
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

        //call the login service to handle the login
        return loginUser(validatedData.data)
    } catch (error) {
        handleApiError(error)
    }
}
