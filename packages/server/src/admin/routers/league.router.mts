import { Router } from "express";
import { DiContainer } from "@way-to-bot/server/services/DI.service.mjs";
import { AdminLeagueController } from "@way-to-bot/server/admin/controllers/league.controller.mjs";
import { validatePayloadMddw } from "@way-to-bot/server/middlewares/validate-payload.mddw.mjs";
import { CommonSchemaGetManyOptions } from "@way-to-bot/shared/api/zod/common/get-many-options.schema.js";
import { getManyOptionsMddw } from "@way-to-bot/server/middlewares/get-many-options.mddw.mjs";
import { GetManyOptionsDTO } from "@way-to-bot/server/DTO/get-many-options.DTO.mjs";
import { LeagueEntity } from "@way-to-bot/server/database/entities/league.entity.mjs";
import {
  AdminSchemaLeagueCreate,
  AdminSchemaLeagueUpdate,
} from "@way-to-bot/shared/api/zod/admin/league.schema.js";

export const AdminLeagueRouter = Router();
const adminLeagueController = DiContainer.get(AdminLeagueController);

AdminLeagueRouter.get(
  "/",
  validatePayloadMddw(CommonSchemaGetManyOptions),
  getManyOptionsMddw,
  async (req, res) => {
    const data = await adminLeagueController.getMany(
      req.query as unknown as GetManyOptionsDTO<LeagueEntity>,
    );
    res.status(200).send(data);
  },
);

AdminLeagueRouter.get("/:id", async (req, res) => {
  const data = await adminLeagueController.getOne(+req.params.id);
  res.status(200).send(data);
});

AdminLeagueRouter.post(
  "/",
  validatePayloadMddw(AdminSchemaLeagueCreate),
  async (req, res) => {
    const data = await adminLeagueController.create(req.body);
    res.status(201).send(data);
  },
);

AdminLeagueRouter.patch(
  "/:id",
  validatePayloadMddw(AdminSchemaLeagueUpdate),
  async (req, res) => {
    const data = await adminLeagueController.update(+req.params.id!, req.body);
    res.status(200).send(data);
  },
);

AdminLeagueRouter.delete("/:id", async (req, res) => {
  const data = await adminLeagueController.delete(+req.params.id);
  res.status(200).send(data);
});
