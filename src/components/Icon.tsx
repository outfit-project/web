import type { ReactNode } from 'react'

export default function Icon({ name, size = 20 }: { name: 'plus' | 'hanger' | 'spark' | 'arrow' | 'upload' | 'check'; size?: number }) {
  const paths: Record<string, ReactNode> = {
    plus: <path d="M12 5v14M5 12h14" />,
    hanger: <path d="M9 6a3 3 0 0 1 6 0c0 2-3 2-3 4l9 6a1 1 0 0 1-.6 2H3.6a1 1 0 0 1-.6-2l9-6" />,
    spark: <><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z" /><path d="m20 2 .5 1.5L22 4l-1.5.5L20 6l-.5-1.5L18 4l1.5-.5L20 2Z" /></>,
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    upload: <><path d="M12 16V3m-5 5 5-5 5 5M4 16v5h16v-5" /></>,
    check: <path d="m5 12 4 4L19 6" />,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}
