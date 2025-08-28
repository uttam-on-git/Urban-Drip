import { showToast } from '@/lib/showToast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'

interface ApiResponse {
    success: boolean
    message: string
}

interface MutationVariables {
    ids: string[]
    deleteType: string
}

const useDeleteMutation = (queryKey: string[], deleteEndpoint: string) => {
    const queryClient = useQueryClient()

    return useMutation<ApiResponse, AxiosError, MutationVariables>({
        mutationFn: async ({ ids, deleteType }) => {
            const { data: response } = await axios({
                url: deleteEndpoint,
                method: deleteType === 'PD' ? 'DELETE' : 'PUT',
                data: { ids, deleteType },
            })

            if (!response.success) {
                throw new Error(response.message)
            }
            return response
        },
        onSuccess: (data) => {
            showToast('success', data.message)
            queryClient.invalidateQueries({ queryKey })
        },
        onError: (error) => {
            showToast('error', error.message)
        },
    })
}

export default useDeleteMutation
