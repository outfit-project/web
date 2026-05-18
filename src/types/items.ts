export interface Item {
    id: string
    user_id: string
    category: string
    image_url: string
}

export interface ItemListResponse {
    items: Item[]
    total: number
}