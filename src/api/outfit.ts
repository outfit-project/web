import { outfitAxios } from './axios'
import type { OutfitItem, OutfitSuggestion } from '../types/item'

export const suggestOutfit = async (topN = 5): Promise<OutfitSuggestion> => {
  const r = await outfitAxios.get<OutfitItem[]>('/outfits/suggest', {
    params: { top_n: topN },
  })
  const items = r.data
  return { items, score: null }
}
