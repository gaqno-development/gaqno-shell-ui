/// <reference types="vite/client" />

declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>
  export default content
}

declare module '*.png' {
  const content: string
  export default content
}

declare module '*.jpg' {
  const content: string
  export default content
}

declare module '*.jpeg' {
  const content: string
  export default content
}

declare module '*.gif' {
  const content: string
  export default content
}

declare module '*.webp' {
  const content: string
  export default content
}

interface ImportMetaEnv {
  readonly VITE_SSO_SERVICE_URL?: string
  readonly VITE_AI_SERVICE_URL?: string
  readonly VITE_CRM_SERVICE_URL?: string
  readonly VITE_ERP_SERVICE_URL?: string
  readonly VITE_FINANCE_SERVICE_URL?: string
  readonly VITE_PDV_SERVICE_URL?: string
  // Add other VITE_ prefixed env vars as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

