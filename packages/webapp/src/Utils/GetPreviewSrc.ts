const FILE_API_URL = import.meta.env.VITE_API_URL;

const getPreviewSrc = (previewUrl?: string) =>
  previewUrl ? `${FILE_API_URL}${previewUrl}` : undefined;

export { getPreviewSrc };
