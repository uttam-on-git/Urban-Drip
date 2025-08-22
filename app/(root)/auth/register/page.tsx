'use client'
import { Card, CardContent } from '@/components/ui/card'
import { zodSchema } from '@/lib/zodSchema'
import Logo from '@/public/assets/images/logo-black.png'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
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
import Link from 'next/link'
import { User_Login } from '@/routes/UserPanelRoutes'
import axios from 'axios'
import { showToast } from '@/lib/showToast'

const LoginPage = () => {
    const [loading, setLoading] = useState(false)
    const [istypePassword, setIsTypePassword] = useState(true)

    const registerSchema = zodSchema
        .pick({
            email: true,
            password: true,
            name: true,
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
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    })

    const handleRegisterSubmit = async (
        values: z.infer<typeof registerSchema>
    ) => {
        try {
            setLoading(true)
            const { data: registerResponse } = await axios.post(
                '/api/auth/register',
                values
            )
            if (!registerResponse.success) {
                throw new Error(registerResponse.message)
            }

            form.reset()
            showToast('success', registerResponse.message)
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
        <Card className='w-[400px]'>
            <CardContent>
                <div className='flex justify-center'>
                    <Image
                        src={Logo.src}
                        alt='Logo'
                        width={Logo.width}
                        height={Logo.height}
                        className='max-w-[150px]'
                    />
                </div>
                <div className='text-center'>
                    <h1 className='text-2xl'>Login Into Account</h1>
                    <p>Ready to dive back in? Enter your details.</p>
                </div>
                <div className='mt-5'>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleRegisterSubmit)}
                        >
                            <div className='mb-5'>
                                <FormField
                                    control={form.control}
                                    name='name'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='text'
                                                    placeholder='your-full-name'
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
                                    name='email'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='email'
                                                    placeholder='your-email@gmail.com'
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
                                    text='Create Account'
                                    loading={loading}
                                />
                            </div>
                            <div className='text-center'>
                                <div className='flex items-center justify-center gap-2'>
                                    <p>Already have an account?</p>
                                    <Link
                                        href={User_Login}
                                        className='text-primary underline'
                                    >
                                        Login
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                </div>
            </CardContent>
        </Card>
    )
}

export default LoginPage
