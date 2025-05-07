import { inject, injectable } from "inversify";
import { AdminParticipateRequestService } from "@way-to-bot/server/admin/services/participate-request.service.mjs";
import { TAdminParticipateRequestApprovePayload } from "@way-to-bot/shared/api/zod/admin/participate-request.schema.js";
import { GetManyOptionsDTO } from "@way-to-bot/server/DTO/get-many-options.DTO.mjs";
import { ParticipateRequestEntity } from "@way-to-bot/server/database/entities/participate-request.entity.mjs";
import {
  AdminDTOParticipateRequestGetMany,
  AdminDTOParticipateRequestGetManyResponse,
  AdminDTOParticipateRequestGetOne,
  AdminDTOParticipateRequestUpdateResponse,
} from "@way-to-bot/shared/api/DTO/admin/participate-request.DTO.js";

@injectable()
export class AdminParticipateRequestController {
  constructor(
    @inject(AdminParticipateRequestService)
    private readonly _participateRequestService: AdminParticipateRequestService,
  ) {}

  async getMany(options?: GetManyOptionsDTO<ParticipateRequestEntity>) {
    const data = await this._participateRequestService.getMany(options);
    return new AdminDTOParticipateRequestGetManyResponse(
      data.data.map((i) => new AdminDTOParticipateRequestGetMany(i)),
      {
        itemsPerPage: options?.getFindOptions?.take,
        pageNumber: options?.getFindOptions?.skip,
        totalRows: data.count,
      },
    );
  }

  async approve(id: number, payload: TAdminParticipateRequestApprovePayload) {
    const data =
      await this._participateRequestService.approveParticipateRequest(
        id,
        payload,
      );

    return new AdminDTOParticipateRequestUpdateResponse(
      new AdminDTOParticipateRequestGetOne(data),
    );
  }
}
