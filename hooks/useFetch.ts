import axios, { AxiosRequestConfig } from "axios";
import { useEffect, useMemo, useState } from "react"

const useFetch = (url: string, method = "GET", options: AxiosRequestConfig = {}) =>  {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<null | string>(null)
    const [refreshIndex, setRefreshIndex] = useState(0)

    const optionsString = JSON.stringify(options)

    const requestOptions = useMemo(() => {
        const opts = {...options}
        if(method === 'POST' && !opts.data) {
            opts.data = {}
        }
        return opts
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [method, optionsString])

    useEffect(() => {
        const apiCall = async () => {
            setLoading(true)
            setError(null)
            try {
                const { data: response} = await axios({
                    url,
                    method,
                    ...(requestOptions)
                })

                if(!response.success) {
                    throw new Error(response.message)
                }
                setData(response)
                setError(null)
            } catch (error) {
                if(error instanceof Error) {
                    setError(error.message)
                }
            } finally {
                setLoading(false)
            }
        }

        apiCall()
    }, [url, refreshIndex, requestOptions, method])

    const refetch = () => {
        setRefreshIndex(prev => prev + 1)
    }

    return { data, error, loading, refetch}
}

export default useFetch