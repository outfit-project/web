import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteItem, getItems, uploadItem } from '../api/wardrobe'
import { suggestOutfit } from '../api/outfit'

export const useItems = () =>
  useQuery({ queryKey: ['items'], queryFn: getItems })

export const useUploadItem = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: uploadItem,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['items'] }),
  })
}

export const useDeleteItem = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteItem,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['items'] }),
  })
}

export const useOutfit = (enabled: boolean) =>
  useQuery({
    queryKey: ['outfit'],
    queryFn: () => suggestOutfit(2),
    enabled,
  })
