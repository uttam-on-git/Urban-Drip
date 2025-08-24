'use client'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { showToast } from '@/lib/showToast'
import { Website_Login } from '@/routes/UserPanelRoutes'
import { logout } from '@/store/reducer/authReducer'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { LuLogOut } from 'react-icons/lu'
import { useDispatch } from 'react-redux'

const LogoutButton = () => {
    const dispatch = useDispatch()
    const router = useRouter()

    const handleLogout = async () => {
        try {
            const { data: logoutResponse } =
                await axios.post('/api/auth/logout')
            if (!logoutResponse.success) {
                throw new Error(logoutResponse.message)
            }

            dispatch(logout())
            showToast('success', logoutResponse.message)
            router.push(Website_Login)
        } catch (error) {
            if (error instanceof Error) {
                showToast('error', error.message)
            } else {
                showToast('error', 'An unknown error ocurred while logout')
            }
        }
    }
    return (
        <DropdownMenuItem onClick={handleLogout} className='cursor-pointer'>
            <LuLogOut color='red' />
            Logout
        </DropdownMenuItem>
    )
}

export default LogoutButton
