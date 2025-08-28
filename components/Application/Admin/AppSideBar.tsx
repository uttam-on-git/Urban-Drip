'use client'

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from '@/components/ui/sidebar'
import Image from 'next/image'
import logoBlack from '@/public/assets/images/logo-black.png'
import logoWhite from '@/public/assets/images/logo-white.png'
import { Button } from '@/components/ui/button'
import { IoMdClose } from 'react-icons/io'
import { LuChevronRight } from 'react-icons/lu'
import { adminAppSidebarMenu } from '@/lib/adminAppSidebarMenu'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'
import Link from 'next/link'

const AppSideBar = () => {
    const { toggleSidebar } = useSidebar()
    return (
        <Sidebar className='z-50'>
            <SidebarHeader className='h-14 border-b p-0'>
                <div className='flex items-center justify-between px-4 mt-0.5'>
                    <Image
                        src={logoBlack.src}
                        height={50}
                        width={logoBlack.width}
                        className='block h-[50px] w-auto dark:hidden'
                        alt='Dark background logo'
                    />
                    <Image
                        src={logoWhite.src}
                        height={50}
                        width={logoWhite.width}
                        className='hidden h-[50px] w-auto dark:block'
                        alt='White Background logo'
                    />
                    <Button
                        onClick={toggleSidebar}
                        type='button'
                        size='icon'
                        className='md:hidden'
                    >
                        <IoMdClose />
                    </Button>
                </div>
            </SidebarHeader>
            <SidebarContent className='p-3'>
                <SidebarMenu>
                    {adminAppSidebarMenu.map((menu, index) => (
                        <Collapsible key={index} className='group/collapsible'>
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                        asChild
                                        className='px-2 py-5 font-semibold'
                                    >
                                        <Link href={menu?.url}>
                                            <menu.icon />
                                            {menu.title}
                                            {menu.submenu &&
                                                menu.submenu.length > 0 && (
                                                    <LuChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                                                )}
                                        </Link>
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                {menu.submenu && menu.submenu.length > 0 && (
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {menu.submenu.map(
                                                (subMenuItem, subMenuIndex) => (
                                                    <SidebarMenuSubItem
                                                        key={subMenuIndex}
                                                    >
                                                        <SidebarMenuSubButton
                                                            asChild
                                                            className='px-2 py-5'
                                                        >
                                                            <Link
                                                                href={
                                                                    subMenuItem.url
                                                                }
                                                            >
                                                                {
                                                                    subMenuItem.title
                                                                }
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                )
                                            )}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                )}
                            </SidebarMenuItem>
                        </Collapsible>
                    ))}
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
    )
}

export default AppSideBar
