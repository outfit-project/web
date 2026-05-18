function resolveApiUrl(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim()
  return (trimmed && trimmed.length > 0 ? trimmed : fallback).replace(/\/$/, '')
}

export const apiBase = {
  auth: resolveApiUrl(import.meta.env.VITE_AUTH_URL, 'http://localhost:8001'),
  wardrobe: resolveApiUrl(import.meta.env.VITE_WARDROBE_URL, 'http://localhost:8002'),
  outfit: resolveApiUrl(import.meta.env.VITE_OUTFIT_URL, 'http://localhost:8003'),
} as const

export const wardrobeImageUrl = (itemId: string): string =>
  `${apiBase.wardrobe}/items/${itemId}/image`
