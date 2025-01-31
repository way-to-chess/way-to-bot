import { Request, Router } from "express";
import { ParticipateRequestController } from "../controllers/participate-request.controller";
import {
  IParticipantRequestDeletePayload,
  IParticipateRequestApprovePayload,
  IParticipateRequestCreatePayload,
  IParticipateRequestUpdatePayload,
} from "../interfaces/participate-request.interface";

export const ParticipateRequestRouter = Router();
const participateRequestController = new ParticipateRequestController();

ParticipateRequestRouter.get("/all", async (req, res) => {
  const data = await participateRequestController.getAllParticipateRequests();
  res.status(200).json({ data });
});

ParticipateRequestRouter.get(
  "/getById/:id",
  async (req: Request<{ id: number }>, res) => {
    if (!req.params?.id) {
      throw new Error("Param id is not found");
    }
    const data = await participateRequestController.getParticipateRequestById(
      req.params.id,
    );
    res.status(200).json({ data });
  },
);

ParticipateRequestRouter.post(
  "/create",
  async (req: Request<{}, {}, IParticipateRequestCreatePayload>, res) => {
    const data = await participateRequestController.createParticipateRequest(
      req.body,
    );
    res.status(200).json({ data });
  },
);

ParticipateRequestRouter.put(
  "/update",
  async (req: Request<{}, {}, IParticipateRequestUpdatePayload>, res) => {
    const data = await participateRequestController.updateParticipateRequest(
      req.body,
    );
    res.status(200).json({ data });
  },
);

ParticipateRequestRouter.post(
  "/approve",
  async (req: Request<{}, {}, IParticipateRequestApprovePayload>, res) => {
    const data = await participateRequestController.approveParticipateRequest(
      req.body,
    );
    res.status(200).json({ data });
  },
);

ParticipateRequestRouter.delete(
  "/delete",
  async (req: Request<{}, {}, IParticipantRequestDeletePayload>, res) => {
    const data = await participateRequestController.deleteParticipateRequest(
      req.body,
    );
    res.status(200).json({ data });
  },
);
