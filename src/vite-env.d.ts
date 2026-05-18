interface ImportMetaEnv {
  readonly VITE_AUTH_URL?: string
  readonly VITE_WARDROBE_URL?: string
  readonly VITE_OUTFIT_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
