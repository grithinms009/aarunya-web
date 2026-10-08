/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE?: string;
  /** 'false' switches the data layer from mock data to the live API. */
  readonly VITE_USE_MOCK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
