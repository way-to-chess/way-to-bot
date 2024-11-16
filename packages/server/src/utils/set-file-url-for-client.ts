export const setFileUrlForClient = (url: string) => {
  return url.replace(process.env.UPLOAD_FOLDER!, "uploads/");
};
