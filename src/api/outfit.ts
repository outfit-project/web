import api from './axios'
import type { OutfitSuggestion } from '../types/item'

export const suggestOutfit = async (topN = 5): Promise<OutfitSuggestion> => {
  const r = await api.get<OutfitSuggestion>('/outfits/suggest', {
    params: { top_n: topN },
  })
  return r.data
}
