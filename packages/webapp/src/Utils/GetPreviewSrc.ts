import { BASE_API_URL } from "../HttpApi/RequestUtils.ts";

const getPreviewSrc = (previewUrl?: string) =>
  previewUrl ? `${BASE_API_URL}/${previewUrl}` : undefined;

export { getPreviewSrc };
