import { ReactNode } from 'react'

interface LayoutProps {
    children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className='flex h-screen w-screen items-center justify-center'>
            {children}
        </div>
    )
}

export default Layout
