/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BIBLIA_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
