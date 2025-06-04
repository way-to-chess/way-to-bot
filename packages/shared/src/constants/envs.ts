import { getNotNil } from "../utils/getNotNil";

interface ViteTypeOptions {
  // strictImportMetaEnv: unknown
}

type ImportMetaEnvFallbackKey =
  "strictImportMetaEnv" extends keyof ViteTypeOptions ? never : string;

interface ImportMetaEnv {
  BASE_URL: string;
  MODE: string;
  DEV: boolean;
  PROD: boolean;
  SSR: boolean;

  [key: ImportMetaEnvFallbackKey]: any;
}

declare global {
  interface ImportMeta {
    url: string;

    readonly env: ImportMetaEnv;
  }
}

const getEnv = (name: string) => {
  return getNotNil(
    import.meta.env[`VITE_${name}`],
    ` add 'VITE_${name}' to .evn file`,
  );
};

const BASE_API_URL = getEnv("API_URL");

const FILE_API_URL = getEnv("FILE_API_URL");

export { BASE_API_URL, FILE_API_URL };
