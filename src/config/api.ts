function resolveApiUrl(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim()
  return (trimmed && trimmed.length > 0 ? trimmed : fallback).replace(/\/$/, '')
}

export const apiBase = resolveApiUrl(import.meta.env.VITE_API_URL, 'http://wardrobe')

export const wardrobeImageUrl = (itemId: string): string =>
  `${apiBase}/items/${itemId}/image`
