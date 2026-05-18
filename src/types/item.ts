export interface Item {
  id: string
  user_id: string
  category: string
  image_url: string
  embedding?: number[]
}

export interface ItemListResponse {
  items: Item[]
  total: number
}

export interface UploadItemResponse {
  item_id: string
  image_url: string
}

export interface OutfitItem {
  id: string
  category: string
  image_url: string
}

export interface OutfitSuggestion {
  items: OutfitItem[]
  score: number | null
}
