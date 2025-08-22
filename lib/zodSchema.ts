import { z } from 'zod'

export const zodSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, { error: 'Name must be at least 3 characters long.' })
        .max(20, { error: 'Name must be at most 20 characters long.' })
        .regex(/^[A-Za-z\s]+$/, {
            error: 'Name can only contain letters and spaces.',
        }),
    email: z.email({
        error: 'Please enter a valid email address.',
    }),
    password: z
        .string()
        .min(8, { error: 'Password must be at least 8 characters long.' })
        .regex(/[a-z]/, { error: 'Password must include a lowercase letter.' })
        .regex(/[A-Z]/, { error: 'Password must include an uppercase letter.' })
        .regex(/[^a-zA-Z0-9]/, {
            error: 'Password must include a special character.',
        }),

    otp: z
        .string()
        .regex(/^\d{6}$/, { message: 'otp must be a 6 digit number' }),
})
