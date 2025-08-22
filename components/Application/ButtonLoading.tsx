import { Loader2Icon } from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

interface ButtonLoadingProps {
    type?: 'button' | 'submit' | 'reset'
    text: string
    onClick?: React.MouseEventHandler<HTMLButtonElement>
    loading: boolean
    className?: string
}

const ButtonLoading: React.FC<ButtonLoadingProps> = ({
    type = 'button',
    text,
    className,
    onClick,
    loading,
    ...props
}) => {
    return (
        <Button
            type={type}
            onClick={onClick}
            className={cn('', className)}
            disabled={loading}
            {...props}
        >
            {loading && <Loader2Icon className='animate-spin' />}
            {text}
        </Button>
    )
}

export default ButtonLoading
