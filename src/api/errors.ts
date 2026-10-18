import axios from 'axios'

export function errorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (!axios.isAxiosError(error)) return fallback
  if (!error.response) return 'Unable to connect. Check your connection and try again.'
  const detail: unknown = error.response.data?.detail
  if (error.response.status === 429) {
    const wait = error.response.headers['retry-after']
    return `Too many attempts. ${wait ? `Try again in ${wait} seconds.` : 'Please wait a moment before trying again.'}`
  }
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    return detail.map((entry: { loc?: string[]; msg?: string }) =>
      `${entry.loc?.filter(part => part !== 'body').join(' ') || 'Input'}: ${entry.msg || 'Invalid value'}`,
    ).join('. ')
  }
  return fallback
}
