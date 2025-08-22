'use client'
import { zodSchema } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import ButtonLoading from '@/components/Application/ButtonLoading'
import { useState } from 'react'
import { FaEyeSlash } from 'react-icons/fa'
import { FaEye } from 'react-icons/fa'
import axios from 'axios'
import { showToast } from '@/lib/showToast'
import { useRouter } from 'next/navigation'
import { Website_Login } from '@/routes/UserPanelRoutes'

const UpdatePassword = ({email} : {email: string}) => {

    const router = useRouter()

    const [loading, setLoading] = useState(false)
    const [istypePassword, setIsTypePassword] = useState(true)

    const registerSchema = zodSchema
        .pick({
            password: true,
            email: true
        })
        .extend({
            confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: 'Password and confirm passsword must be same.',
            path: ['confirmPassword'],
        })
    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: email,
            password: '',
            confirmPassword: '',
        },
    })

    const handlePasswordUpdate = async (
        values: z.infer<typeof registerSchema>
    ) => {
        try {
            setLoading(true)
            const { data: passwordUpdateResponse } = await axios.put(
                '/api/auth/reset-password/update-password',
                values
            )
            if (!passwordUpdateResponse.success) {
                throw new Error(passwordUpdateResponse.message)
            }
            form.reset()
            showToast('success', passwordUpdateResponse.message)
            router.push(Website_Login)
        } catch (error) {
            if (error instanceof Error) {
                showToast('error', error.message)
            } else {
                showToast('error', 'An unexpected error occurred')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
            <div>
                <div className='text-center'>
                    <h1 className='text-2xl'>Update Password</h1>
                    <p>Create new password by filling below form.</p>
                </div>
                <div className='mt-5'>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handlePasswordUpdate)}
                        >
                            <div className='mb-5'>
                                <FormField
                                    control={form.control}
                                    name='password'
                                    render={({ field }) => (
                                        <FormItem className='relative'>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='password'
                                                    placeholder='************'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='mb-5'>
                                <FormField
                                    control={form.control}
                                    name='confirmPassword'
                                    render={({ field }) => (
                                        <FormItem className='relative'>
                                            <FormLabel>
                                                Confirm Password
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type={
                                                        istypePassword
                                                            ? 'password'
                                                            : 'text'
                                                    }
                                                    placeholder='************'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <button
                                                type='button'
                                                className='absolute top-1/2 right-2 cursor-pointer'
                                                onClick={() =>
                                                    setIsTypePassword(
                                                        !istypePassword
                                                    )
                                                }
                                            >
                                                {istypePassword ? (
                                                    <FaEyeSlash />
                                                ) : (
                                                    <FaEye />
                                                )}
                                            </button>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='mb-3'>
                                <ButtonLoading
                                    type='submit'
                                    className='w-full cursor-pointer'
                                    text='Update Password'
                                    loading={loading}
                                />
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
    )
}

export default UpdatePassword