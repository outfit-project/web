import { wardrobeImageUrl } from '../config/api'
import api from './axios'
import type { ItemListResponse, UploadItemResponse } from '../types/item'

export const getItems = async (): Promise<ItemListResponse> => {
  const r = await api.get<ItemListResponse>('/items/')
  return r.data
}

export const uploadItem = async (formData: FormData): Promise<UploadItemResponse> => {
  const r = await api.post<UploadItemResponse>('/items/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return r.data
}

export const deleteItem = async (id: string): Promise<void> => {
  await api.delete(`/items/${id}`)
}

export const getItemImageUrl = (id: string): string => wardrobeImageUrl(id)
