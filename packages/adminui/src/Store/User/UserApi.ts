import { adminApi } from "../AdminApi";
import {
  AdminDTOUserCreateResponse,
  AdminDTOUserDeleteResponse,
  AdminDTOUserGetManyResponse,
  AdminDTOUserGetOne,
} from "@way-to-bot/shared/api/DTO/admin/user.DTO";
import { TAdminUserCreatePayload } from "@way-to-bot/shared/api/zod/admin/user.schema";
import {
  createEndpointFactory,
  deleteEndpointFactory,
  getManyEndpointFactory,
} from "../Factories";

const userApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    getAllUsers: getManyEndpointFactory<AdminDTOUserGetManyResponse>(
      build,
      "user",
    ),
    getUserById: getManyEndpointFactory<AdminDTOUserGetOne>(build, "user"),
    createUser: createEndpointFactory<
      AdminDTOUserCreateResponse,
      TAdminUserCreatePayload
    >(build, "user"),
    deleteUser: deleteEndpointFactory<AdminDTOUserDeleteResponse>(
      build,
      "user",
    ),
  }),
});

export { userApi };
