import { webAppApi } from "../WebAppApi";
import { IResponseWithData } from "@way-to-bot/shared/interfaces/response.interface";
import {
  IUser,
  IUserCreatePayload,
} from "@way-to-bot/shared/interfaces/user.interface";

const userApi = webAppApi.injectEndpoints({
  endpoints: (build) => ({
    getAllUsers: build.query<IUser[], void>({
      query: () => "user/all",
      transformResponse: (data: IResponseWithData<IUser[]>) => data.data,
    }),
    createUser: build.mutation<boolean, IUserCreatePayload>({
      query: (payload) => ({
        url: "user/create",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export { userApi };
