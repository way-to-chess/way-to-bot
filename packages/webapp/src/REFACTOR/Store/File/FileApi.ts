import {ClientDTOFileCreateResponse, ClientDTOFileGetOne} from "@way-to-bot/shared/api/DTO/client/file.DTO";
import {clientApi} from "../ClientApi";

const fileApi = clientApi.injectEndpoints({
    endpoints: (build) => ({
        uploadFile: build.mutation<ClientDTOFileGetOne, FormData>({
            query: (file) => ({
                method: "POST",
                url: "file",
                body: file,
            }),
            transformResponse: (data: ClientDTOFileCreateResponse) => data.data,
        }),
    }),
});

export {fileApi};
