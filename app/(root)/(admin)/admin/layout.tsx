import AppSideBar from '@/components/Application/Admin/AppSideBar'
import { ThemeProvider } from '@/components/Application/Admin/ThemeProvider'
import TopBar from '@/components/Application/Admin/TopBar'
import { SidebarProvider } from '@/components/ui/sidebar'

const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
        >
            <SidebarProvider>
                <AppSideBar />
                <main className='md:w-[calc(100vw-16rem)]'>
                    <div className='min-h-[calc(100vh-40px)] px-8 pt-[70px] pb-10'>
                        <TopBar />
                        {children}
                    </div>
                    <div className='dark:bg-background flex h-[40px] items-center justify-center border-t bg-gray-50 text-sm'>
                        © 2025 WebForgeLab. All Rights Reserved.
                    </div>
                </main>
            </SidebarProvider>
        </ThemeProvider>
    )
}

export default layout
