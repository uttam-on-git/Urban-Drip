'use client'

import { Button } from '@/components/ui/button'
import ThemeSwitch from './ThemeSwitch'
import UserDropdown from './UserDropdown'
import { RiMenu4Fill } from 'react-icons/ri'
import { useSidebar } from '@/components/ui/sidebar'

const TopBar = () => {
    const { toggleSidebar } = useSidebar()
    return (
        <div className='dark:bg-card fixed top-0 left-0 z-30 flex h-14 w-full items-center justify-between border bg-white px-5 md:ps-72 md:pe-8'>
            <div>search components</div>

            <div className='flex items-center gap-2'>
                <ThemeSwitch />
                <UserDropdown />
                <Button
                    onClick={toggleSidebar}
                    type='button'
                    size='icon'
                    className='ms-2 md:hidden'
                >
                    <RiMenu4Fill />
                </Button>
            </div>
        </div>
    )
}

export default TopBar
