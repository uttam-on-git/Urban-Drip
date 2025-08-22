import { zodSchema } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp'
import ButtonLoading from './ButtonLoading'
import { useState } from 'react'
import axios from 'axios'
import { showToast } from '@/lib/showToast'

interface OtpVerificationFormProps {
    email: string
    onSubmit: (values: { otp: string; email: string }) => void
    loading: boolean
}

const OtpVerificationForm = ({
    email,
    onSubmit,
    loading,
}: OtpVerificationFormProps) => {
    const [isResendingOtp, setIsResendingOtp] = useState(false)

    const formSchema = zodSchema.pick({
        email: true,
        otp: true,
    })

    const form = useForm<{ email: string; otp: string }>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: email,
            otp: '',
        },
    })

    const handleOtpVerification = async (values: {
        otp: string
        email: string
    }) => {
        onSubmit(values)
    }

    const resendOtp = async () => {
        try {
            setIsResendingOtp(true)
            const { data: otpResendResponse } = await axios.post(
                '/api/auth/otp-resend',
                { email }
            )
            console.log(otpResendResponse)
            if (!otpResendResponse.success) {
                throw new Error(otpResendResponse.message)
            }

            showToast('success', otpResendResponse.message)
        } catch (error) {
            if (error instanceof Error) {
                showToast('error', error.message)
            } else {
                showToast('error', 'An unexpected error occurred')
            }
        } finally {
            setIsResendingOtp(false)
        }
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleOtpVerification)}>
                    <div className='text-center'>
                        <h1 className='mb-2 text-2xl font-bold'>
                            Please complete verification
                        </h1>
                        <p>
                            We have sent an OTP to your registered email
                            address. The OTP is valid for 10min only.
                        </p>
                    </div>
                    <div className='mt-5 mb-5 flex justify-center'>
                        <FormField
                            control={form.control}
                            name='otp'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='font-semibold'>
                                        ONE-Time Password (OTP)
                                    </FormLabel>
                                    <FormControl>
                                        <InputOTP maxLength={6} {...field}>
                                            <InputOTPGroup>
                                                <InputOTPSlot
                                                    className='size-10 text-xl'
                                                    index={0}
                                                />
                                                <InputOTPSlot
                                                    className='size-10 text-xl'
                                                    index={1}
                                                />
                                                <InputOTPSlot
                                                    className='size-10 text-xl'
                                                    index={2}
                                                />
                                                <InputOTPSlot
                                                    className='size-10 text-xl'
                                                    index={3}
                                                />
                                                <InputOTPSlot
                                                    className='size-10 text-xl'
                                                    index={4}
                                                />
                                                <InputOTPSlot
                                                    className='size-10 text-xl'
                                                    index={5}
                                                />
                                            </InputOTPGroup>
                                        </InputOTP>
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
                            text='Verify'
                            loading={loading}
                        />
                    </div>

                    {!isResendingOtp ? (
                        <div className='mt-5 text-center'>
                            <button
                                type='submit'
                                onClick={resendOtp}
                                className='cursor-pointer text-blue-500 hover:underline'
                            >
                                Resend OTP
                            </button>
                        </div>
                    ) : (
                        <span>Resending...</span>
                    )}
                </form>
            </Form>
        </div>
    )
}

export default OtpVerificationForm
