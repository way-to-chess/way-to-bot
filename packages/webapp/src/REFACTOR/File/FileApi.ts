import { webAppApi } from "../WebAppApi";
import { IResponseWithData } from "@way-to-bot/shared/interfaces/response.interface";
import { IFile } from "@way-to-bot/shared/interfaces/file.interface";

const fileApi = webAppApi.injectEndpoints({
  endpoints: (build) => ({
    uploadFile: build.mutation<IFile, FormData>({
      query: (file) => ({
        method: "POST",
        url: "file/upload",
        body: file,
      }),
      transformResponse: (data: IResponseWithData<IFile>) => data.data,
    }),
  }),
});

export { fileApi };
