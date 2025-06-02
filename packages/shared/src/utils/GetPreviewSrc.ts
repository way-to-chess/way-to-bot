import { FILE_API_URL } from "../constants/envs";

const getPreviewSrc = (previewUrl?: string | null) =>
  previewUrl ? `${FILE_API_URL}/${previewUrl}` : undefined;

export { getPreviewSrc };
