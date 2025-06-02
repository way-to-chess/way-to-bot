import { getNotNil } from "../utils/getNotNil";

declare global {
  interface ImportMeta {
    readonly env: Record<string, string>;
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
