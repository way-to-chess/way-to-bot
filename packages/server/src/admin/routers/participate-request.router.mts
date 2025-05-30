import { Router } from "express";
import { DiContainer } from "@way-to-bot/server/services/DI.service.mjs";
import { AdminParticipateRequestController } from "@way-to-bot/server/admin/controllers/participate-request.controller.mjs";
import { validatePayloadMddw } from "@way-to-bot/server/express/middlewares/validate-payload.mddw.mjs";
import { CommonSchemaGetManyOptions } from "@way-to-bot/shared/api/zod/common/get-many-options.schema.js";
import { getManyOptionsMddw } from "@way-to-bot/server/express/middlewares/get-many-options.mddw.mjs";
import { GetManyOptionsDTO } from "@way-to-bot/server/DTO/get-many-options.DTO.mjs";
import { ParticipateRequestEntity } from "@way-to-bot/server/database/entities/participate-request.entity.mjs";
import { AdminSchemaParticipateRequestApprove } from "@way-to-bot/shared/api/zod/admin/participate-request.schema.js";

export const AdminParticipateRequestRouter = Router();
const adminParticipateRequestController = DiContainer.get(
  AdminParticipateRequestController,
);

AdminParticipateRequestRouter.get(
  "/",
  validatePayloadMddw(CommonSchemaGetManyOptions),
  getManyOptionsMddw,
  async (req, res) => {
    const data = await adminParticipateRequestController.getMany(
      req.getManyOptions as GetManyOptionsDTO<ParticipateRequestEntity>,
    );
    res.status(200).send(data);
  },
);

AdminParticipateRequestRouter.patch(
  "/approve/:id",
  validatePayloadMddw(AdminSchemaParticipateRequestApprove),
  async (req, res) => {
    const data = await adminParticipateRequestController.approve(
      +req.params.id!,
      req.body,
    );
    res.status(200).send(data);
  },
);
