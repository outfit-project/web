export interface OutfitItem {
    id: string
    category: string
    image_url: string
}

export interface Outfit {
    score: number
    item: Outfit[]
}