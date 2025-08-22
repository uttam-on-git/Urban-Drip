import { Bounce, toast, ToastPosition } from 'react-toastify'

export const showToast = (type: string, message: string) => {
    const options = {
        position: 'top-right' as ToastPosition,
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
    }
    switch (type) {
        case 'info':
            toast.info(message, options)
            break
        case 'success':
            toast.success(message, options)
            break
        case 'error':
            toast.error(message, options)
            break
        case 'warning':
            toast.warning(message, options)
            break
        default:
            toast(message, options)
            break
    }
}
