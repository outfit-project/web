export type ProcessingStatus = 'pending' | 'processing' | 'ready' | 'failed'

export interface OutfitItem {
  id: string
  user_id: string
  category: string | null
  subcategory: string | null
  style: string | null
  color_hex: string | null
  image_url: string
}
export interface Item extends OutfitItem {
  embedding?: number[] | null
  processing_status: ProcessingStatus
  processing_error: string | null
  created_at: string
}
export interface ItemListResponse { items: Item[]; total: number }
export interface UploadItemResponse {
  item_id: string
  image_url: string
  processing_status: ProcessingStatus
}
export interface OutfitSuggestion {
  items: OutfitItem[]
  score: number | null
  message: string | null
}
