import { use } from "react"

interface ParamsProps {
    params: Promise<{ id: string }>
}

const MediaEdit = ({params} : ParamsProps) => {
    const {id} = use(params)

    
    return <div>page</div>
}

export default MediaEdit
