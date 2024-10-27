import { Request, Router } from "express";
import { LocationController } from "../controllers/location.controller";
import {
  ILocationCreatePayload,
  ILocationDeletePayload,
  ILocationUpdatePayload,
} from "@way-to-bot/shared/src/interfaces/location.interface";

export const LocationRouter = Router();
const locationController = new LocationController();

LocationRouter.get("/all", async (req, res) => {
  const data = await locationController.getAllLocations();
  res.status(200).json({ data });
});

LocationRouter.get(
  "/getById/:id",
  async (req: Request<{ id: number }>, res) => {
    if (!req.params?.id) {
      throw new Error("Param id is not found");
    }
    const data = await locationController.getLocationById(req.params.id);
    res.status(200).json({ data });
  },
);

LocationRouter.post(
  "/create",
  async (req: Request<{}, {}, ILocationCreatePayload>, res) => {
    const data = await locationController.createLocation(req.body);
    res.status(200).json({ data });
  },
);

LocationRouter.put(
  "/update",
  async (req: Request<{}, {}, ILocationUpdatePayload>, res) => {
    const data = await locationController.updateLocation(req.body);
    res.status(200).json({ data });
  },
);

LocationRouter.delete(
  "/delete",
  async (req: Request<{}, {}, ILocationDeletePayload>, res) => {
    const data = await locationController.deleteLocation(req.body);
    res.status(200).json({ data });
  },
);
