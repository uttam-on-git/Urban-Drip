"use client"
import { persistor, store } from '@/store/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import Loading from './Loading'

const GlobalStoreProvider = ({children} : Readonly<{
    children: React.ReactNode
}>) => {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loading/>} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}

export default GlobalStoreProvider