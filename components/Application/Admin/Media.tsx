import { Checkbox } from '@/components/ui/checkbox'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ADMIN_MEDIA_EDIT } from '@/routes/AdminPanelRoutes'
import Image from 'next/image'
import Link from 'next/link'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { MdOutlineModeEditOutline } from 'react-icons/md'
import { IoIosLink } from 'react-icons/io'
import { GoTrash } from 'react-icons/go'
import { showToast } from '@/lib/showToast'
import { Dispatch, SetStateAction } from 'react'

interface Media {
    id: string
    asset_id: string
    public_id: string
    path: string
    secure_url: string
    thumbnail_url: string
    alt: null
    title: null
    deletedAt: null
    createdAt: Date
    updatedAt: Date
}

interface MediaProps {
    media: Media
    handleDelete: (selectedMedia: string[], deleteType: string) => void
    deleteType: string
    selectedMedia: string[]
    setSelectedMedia: Dispatch<SetStateAction<string[]>>
}

const Media = ({
    media,
    handleDelete,
    deleteType,
    selectedMedia,
    setSelectedMedia,
}: MediaProps) => {
    const handleCheck = () => {
        let newSelectedMedia = [...selectedMedia]
        if (selectedMedia.includes(media.id)) {
            newSelectedMedia = selectedMedia.filter(
                (id: string) => id !== media.id
            )
        } else {
            newSelectedMedia = [...selectedMedia, media.id]
        }

        setSelectedMedia(newSelectedMedia)
    }

    const handleCopyLink = async (url: string) => {
        await navigator.clipboard.writeText(url)
        showToast('success', 'Link Copied.')
    }

    return (
        <div className='group relative overflow-hidden rounded border border-gray-200 dark:border-gray-800'>
            <div className='absolute top-2 left-2 z-20'>
                <Checkbox
                    checked={selectedMedia.includes(media.id)}
                    onCheckedChange={handleCheck}
                    className='border-primary cursor-pointer'
                />
            </div>
            <div className='absolute top-2 right-2 z-20'>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <span className='flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black/50'>
                            <BsThreeDotsVertical color='#fff' />
                        </span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='start'>
                        {deleteType === 'SD' && (
                            <>
                                <DropdownMenuItem
                                    className='cursor-pointer'
                                    asChild
                                >
                                    <Link href={ADMIN_MEDIA_EDIT(media.id)}>
                                        <MdOutlineModeEditOutline color='blue' />
                                        Edit
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    className='cursor-pointer'
                                    onClick={() =>
                                        handleCopyLink(media.secure_url)
                                    }
                                >
                                    <IoIosLink />
                                    Copy Link
                                </DropdownMenuItem>
                            </>
                        )}
                        <DropdownMenuItem
                            className='cursor-pointer'
                            onClick={() => handleDelete([media.id], deleteType)}
                        >
                            <GoTrash color='red' />
                            {deleteType === 'SD'
                                ? 'Move into trash'
                                : 'Delete Permanentaly'}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className='absolute z-10 h-full w-full transition-all duration-150 ease-in group-hover:bg-black/30'></div>
            <div>
                <Image
                    src={media?.secure_url}
                    alt={media?.alt || 'Image'}
                    height={300}
                    width={300}
                    className='h-[150px] w-full object-cover sm:h-[200px]'
                />
            </div>
        </div>
    )
}

export default Media
