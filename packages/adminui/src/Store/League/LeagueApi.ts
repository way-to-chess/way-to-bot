import { adminApi } from "../AdminApi";
import {
  AdminDTOLeagueCreateResponse,
  AdminDTOLeagueDeleteResponse,
  AdminDTOLeagueGetManyResponse,
  AdminDTOLeagueGetOne,
} from "@way-to-bot/shared/api/DTO/admin/league.DTO";
import { TAdminLeagueCreatePayload } from "@way-to-bot/shared/api/zod/admin/league.schema";
import {
  createEndpointFactory,
  deleteEndpointFactory,
  getManyEndpointFactory,
  getOneEndpointFactory,
} from "../Factories";

const leagueApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    getAllLeagues: getManyEndpointFactory<AdminDTOLeagueGetManyResponse>(
      build,
      "league",
    ),
    getLeagueById: getOneEndpointFactory<AdminDTOLeagueGetOne>(build, "league"),
    createLeague: createEndpointFactory<
      AdminDTOLeagueCreateResponse,
      TAdminLeagueCreatePayload
    >(build, "league"),
    deleteLeague: deleteEndpointFactory<AdminDTOLeagueDeleteResponse>(
      build,
      "league",
    ),
  }),
});

export { leagueApi };
