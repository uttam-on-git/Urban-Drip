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
import { User_Dashboard, Website_Register, Website_ResetPassword } from '@/routes/UserPanelRoutes'
import axios from 'axios'
import { showToast } from '@/lib/showToast'
import OtpVerificationForm from '@/components/Application/OtpVerificationForm'
import { useDispatch } from 'react-redux'
import { login } from '@/store/reducer/authReducer'
import { useRouter, useSearchParams } from 'next/navigation'
import { ADMIN_DASHBOARD } from '@/routes/AdminPanelRoutes'

const LoginPage = () => {
    const dispatch = useDispatch()
    const searchParams = useSearchParams()
    const router = useRouter()

    const [loading, setLoading] = useState(false)
    const [otpVerificationloading, setOtpVerificationLoading] = useState(false)
    const [istypePassword, setIsTypePassword] = useState(true)
    const [otpEmail, setOtpEmail] = useState<string | null>()

    const loginSchema = zodSchema
        .pick({
            email: true,
        })
        .extend({
            password: z.string().min(3, 'Password field is required'),
        })
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const handleLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
        try {
            setLoading(true)
            const { data: loginResponse } = await axios.post(
                '/api/auth/login',
                values
            )
            console.log("loginResponse", loginResponse)
            if (!loginResponse.success) {
                throw new Error(loginResponse.message)
            }

            setOtpEmail(values.email)
            form.reset()
            showToast('success', loginResponse.message)
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

    //otp verification
    const handleOtpVerification = async (values: {
        email: string
        otp: string
    }) => {
        try {
            console.log('from otp veri')
            setOtpVerificationLoading(true)
            const { data: otpResponse } = await axios.post(
                '/api/auth/verify-otp',
                values
            )
            if (!otpResponse.success) {
                throw new Error(otpResponse.message)
            }

            setOtpEmail('')
            showToast('success', otpResponse.message)
            dispatch(login(otpResponse.data))

            const callbackUrl = searchParams.get('callback');
            console.log("Otp response",otpResponse)

            if(callbackUrl) {
                router.push(callbackUrl)
            } else {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                otpResponse.data.role === 'ADMIN' ? router.push(ADMIN_DASHBOARD) : router.push(User_Dashboard)
            }
        } catch (error) {
            if (error instanceof Error) {
                showToast('error', error.message)
            } else {
                showToast('error', 'An unexpected error occurred')
            }
        } finally {
            setOtpVerificationLoading(false)
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

                {!otpEmail ? (
                    <>
                        <div className='text-center'>
                            <h1 className='text-2xl'>Login Into Account</h1>
                            <p>Ready to dive back in? Enter your details.</p>
                        </div>
                        <div className='mt-5'>
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(
                                        handleLoginSubmit
                                    )}
                                >
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
                                                    <FormLabel>
                                                        Password
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
                                            text='Login'
                                            loading={loading}
                                        />
                                    </div>
                                    <div className='text-center'>
                                        <div className='flex items-center justify-center gap-2'>
                                            <p>Don&apos;t have an account?</p>
                                            <Link
                                                href={Website_Register}
                                                className='text-primary underline'
                                            >
                                                Create an Account
                                            </Link>
                                        </div>
                                        <div>
                                            <Link
                                                href={Website_ResetPassword}
                                                className='text-primary underline'
                                            >
                                                Forgot Password
                                            </Link>
                                        </div>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </>
                ) : (
                    <>
                        <OtpVerificationForm
                            email={otpEmail}
                            loading={otpVerificationloading}
                            onSubmit={handleOtpVerification}
                        />
                    </>
                )}
            </CardContent>
        </Card>
    )
}

export default LoginPage