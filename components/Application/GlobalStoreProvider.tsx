'use client'
import { persistor, store } from '@/store/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import Loading from './Loading'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Suspense } from 'react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()

const GlobalStoreProvider = ({
    children,
}: Readonly<{
    children: React.ReactNode
}>) => {
    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <PersistGate loading={<Loading />} persistor={persistor}>
                    {children}
                </PersistGate>
            </Provider>
            <Suspense fallback={null}>
                <ReactQueryDevtools initialIsOpen={false} />
            </Suspense>
        </QueryClientProvider>
    )
}

export default GlobalStoreProvider
