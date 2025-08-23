import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import adminLogo from '@/public/assets/images/user.png'
import { useAppSelector } from '@/store/hooks'
import Link from 'next/link'
import { IoShirtOutline } from 'react-icons/io5'
import { MdOutlineShoppingBag } from 'react-icons/md'
import LogoutButton from './LogoutButton'

const UserDropdown = () => {
    const auth = useAppSelector((store) => store.authStore.auth)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar>
                    <AvatarImage src={adminLogo.src} />
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='me-5 w-44'>
                <DropdownMenuLabel>
                    <p className='font-semibold'> {auth?.name}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href='' className='cursor-pointer'>
                        <IoShirtOutline />
                        New Product
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href='' className='cursor-pointer'>
                        <MdOutlineShoppingBag />
                        Orders
                    </Link>
                </DropdownMenuItem>

                <LogoutButton />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserDropdown
