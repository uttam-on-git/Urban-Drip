'use client'
import { Card, CardContent } from '@/components/ui/card'
import { zodSchema } from '@/lib/zodSchema'
import Logo from '@/public/assets/images/logo-black.png'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
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
import Link from 'next/link'
import { Website_Login } from '@/routes/UserPanelRoutes'
import axios from 'axios'
import { showToast } from '@/lib/showToast'
import OtpVerificationForm from '@/components/Application/OtpVerificationForm'
import UpdatePassword from '@/components/Application/UpdatePassword'

const ResetPassword = () => {
    const [emailVerificationLoading, setEmailVerificationLoading] =
        useState(false)
    const [otpVerificationloading, setOtpVerificationLoading] = useState(false)
    const [otpEmail, setOtpEmail] = useState<string | null>()
    const [isOtpVerified, setIsOtpVerified] = useState(false)

    const formSchema = zodSchema.pick({
        email: true,
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
        },
    })

    const handleEmailVerification = async (values: { email: string }) => {
        try {
            setEmailVerificationLoading(true)
            const { data: sendOtpResponse } = await axios.post(
                '/api/auth/reset-password/send-otp',
                values
            )
            if (!sendOtpResponse.success) {
                throw new Error(sendOtpResponse.message)
            }

            setOtpEmail(values.email)
            showToast('success', sendOtpResponse.message)
        } catch (error) {
            if (error instanceof Error) {
                showToast('error', error.message)
            } else {
                showToast('error', 'An unexpected error occurred')
            }
        } finally {
            setEmailVerificationLoading(false)
        }
    }

    //otp verification
    const handleOtpVerification = async (values: {
        email: string
        otp: string
    }) => {
        try {
            setOtpVerificationLoading(true)
            const { data: otpResponse } = await axios.post(
                '/api/auth/reset-password/verify-otp',
                values
            )
            if (!otpResponse.success) {
                throw new Error(otpResponse.message)
            }

            showToast('success', otpResponse.message)
            setIsOtpVerified(true)
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
                            <h1 className='text-2xl'>Reset Password</h1>
                            <p>Enter your email for password reset.</p>
                        </div>
                        <div className='mt-5'>
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(
                                        handleEmailVerification
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
                                    <div className='mb-3'>
                                        <ButtonLoading
                                            type='submit'
                                            className='w-full cursor-pointer'
                                            text='Send OTP'
                                            loading={emailVerificationLoading}
                                        />
                                    </div>
                                    <div className='text-center'>
                                        <div className='flex items-center justify-center gap-2'>
                                            <Link
                                                href={Website_Login}
                                                className='text-primary underline'
                                            >
                                                Back to login
                                            </Link>
                                        </div>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </>
                ) : (
                    <>
                        {!isOtpVerified ? (
                            <OtpVerificationForm
                                email={otpEmail}
                                loading={otpVerificationloading}
                                onSubmit={handleOtpVerification}
                            />
                        ) : (
                            <UpdatePassword email={otpEmail} />
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    )
}

export default ResetPassword
