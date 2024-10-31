import { EventController } from "../controllers/event.controller";
import { Request, Router } from "express";
import {
  IEventCreatePayload,
  IEventDeletePayload,
  IEventUpdatePayload,
} from "../interfaces/event.interface";

export const EventRouter = Router();

const eventController = new EventController();

EventRouter.get("/all", async (req, res) => {
  const data = await eventController.getAllEvents();
  res.status(200).json({ data });
});

EventRouter.get("/getById/:id", async (req: Request<{ id: number }>, res) => {
  if (!req.params?.id) {
    throw new Error("Param id is not found");
  }
  const data = await eventController.getEventById(req.params.id);
  res.status(200).json({ data });
});

EventRouter.post(
  "/create",
  async (req: Request<{}, {}, IEventCreatePayload>, res) => {
    const data = await eventController.createEvent(req.body);
    res.status(200).json({ data });
  },
);

EventRouter.put(
  "/update",
  async (req: Request<{}, {}, IEventUpdatePayload>, res) => {
    const data = await eventController.updateEvent(req.body);
    res.status(200).json({ data });
  },
);

EventRouter.delete(
  "/delete",
  async (req: Request<{}, {}, IEventDeletePayload>, res) => {
    const data = await eventController.deleteEvent(req.body);
    res.status(200).json({ data });
  },
);
