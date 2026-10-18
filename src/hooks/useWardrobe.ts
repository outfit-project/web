import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteItem, getItems, retryItem, uploadItem } from '../api/wardrobe'
import { suggestOutfit } from '../api/outfit'
import { useAuthStore } from '../store/auth.store'

export const useItems = () => {
  const token = useAuthStore(state => state.token)
  const session = useAuthStore(state => state.sessionVersion)
  return useQuery({
    queryKey: ['items', session],
    queryFn: getItems,
    enabled: !!token,
    refetchInterval: query => query.state.data?.items.some(item =>
      item.processing_status === 'pending' || item.processing_status === 'processing') ? 3_000 : false,
  })
}
export const useUploadItem = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: uploadItem, onSuccess: () => qc.invalidateQueries({ queryKey: ['items'] }) })
}
export const useDeleteItem = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: deleteItem, onSuccess: () => {
    void qc.invalidateQueries({ queryKey: ['items'] })
    void qc.invalidateQueries({ queryKey: ['outfit'] })
  } })
}
export const useRetryItem = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: retryItem, onSuccess: () => qc.invalidateQueries({ queryKey: ['items'] }) })
}
export const useOutfit = () => useMutation({ mutationFn: () => suggestOutfit(5) })
