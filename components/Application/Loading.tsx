import React from 'react'
import loading from '@/public/assets/images/loading.svg'
import Image from 'next/image'

const Loading = () => {
    return (
        <div className='mt-12 flex h-screen w-screen items-start justify-center'>
            <Image
                src={loading.src}
                alt='loading state'
                width={80}
                height={80}
            ></Image>
        </div>
    )
}

export default Loading
