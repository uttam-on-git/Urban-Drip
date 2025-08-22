'use client'

import { Card, CardContent } from '@/components/ui/card'
import axios from 'axios'
import { use, useEffect, useState } from 'react'
import verifiedImage from '@/public/assets/images/verified.gif'
import verificationFailedImage from '@/public/assets/images/verification-failed.gif'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { User_Home } from '@/routes/UserPanelRoutes'
import Link from 'next/link'

interface PageProps {
    params: Promise<{ token: string }>
}
const EmailVerification = ({ params }: PageProps) => {
    const { token } = use(params)

    const [isVerified, setIsVerified] = useState(false)

    useEffect(() => {
        const verify = async () => {
            const { data: verificationResponse } = await axios.post(
                '/api/auth/verify-email',
                { token }
            )
            if (verificationResponse.success) {
                setIsVerified(true)
            }
        }

        verify()
    }, [token])

    return (
        <Card>
            <CardContent>
                {isVerified ? (
                    <div>
                        <div className='flex items-center justify-center'>
                            <Image
                                src={verifiedImage.src}
                                alt='verified Image'
                                height={100}
                                width={100}
                            />
                        </div>
                        <div className='text-center'>
                            <h1 className='my-5 text-2xl font-bold text-green-700'>
                                Email verification success.
                            </h1>
                            <Button asChild>
                                <Link href={User_Home}>Continue Shoping</Link>
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className='flex items-center justify-center'>
                            <Image
                                src={verificationFailedImage.src}
                                alt='verified Image'
                                height={100}
                                width={100}
                            />
                        </div>
                        <div className='text-center'>
                            <h1 className='my-5 text-2xl font-bold text-red-700'>
                                Email verification failed.
                            </h1>
                            <Button asChild>
                                <Link href={User_Home}>Continue Shoping</Link>
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default EmailVerification
