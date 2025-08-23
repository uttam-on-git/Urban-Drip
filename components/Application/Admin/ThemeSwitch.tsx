'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { IoSunny } from 'react-icons/io5'
import { FaMoon } from 'react-icons/fa6'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'

const ThemeSwitch = () => {
    const { setTheme } = useTheme()
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    type='button'
                    variant='ghost'
                    className='cursor-pointer'
                >
                    <IoSunny className='dark:hidden' />
                    <FaMoon className='hidden dark:block' />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setTheme('light')}>
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ThemeSwitch
