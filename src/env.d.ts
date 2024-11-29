/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
    readonly MICROCMS_SERVICE_DOMAIN: string
    readonly MICROCMS_API_KEY: string
    readonly PUBLIC_MICROCMS_SERVICE_DOMAIN: string
    readonly PUBLIC_MICROCMS_API_KEY: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
