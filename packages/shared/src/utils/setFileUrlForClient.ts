import path from "node:path";

export const setFileUrlForClient = (url: string) => {
  return path.join("/uploads", path.basename(url));
};
