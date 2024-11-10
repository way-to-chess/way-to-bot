import {EventController} from "../controllers/event.controller";
import {Request, Router} from "express";

import {
    IAddUsersToEventPayload,
    IEventCreatePayload,
    IEventDeletePayload,
    IEventUpdatePayload,
    IRemoveUsersFromEventPayload
} from "@way-to-bot/shared/interfaces/event.interface";

export const EventRouter = Router();

const eventController = new EventController();

EventRouter.get("/all", async (req, res) => {
    const data = await eventController.getAllEvents();
    res.status(200).json({data});
});

EventRouter.get("/getById/:id", async (req: Request<{ id: number }>, res) => {
    if (!req.params?.id) {
        throw new Error("Param id is not found");
    }
    const data = await eventController.getEventById(req.params.id);
    res.status(200).json({data});
});

EventRouter.post(
    "/create",
    async (req: Request<{}, {}, IEventCreatePayload>, res) => {
        const data = await eventController.createEvent(req.body);
        res.status(200).json({data});
    },
);

EventRouter.put(
    "/update",
    async (req: Request<{}, {}, IEventUpdatePayload>, res) => {
        const data = await eventController.updateEvent(req.body);
        res.status(200).json({data});
    },
);

EventRouter.delete(
    "/delete",
    async (req: Request<{}, {}, IEventDeletePayload>, res) => {
        const data = await eventController.deleteEvent(req.body);
        res.status(200).json({data});
    },
);

EventRouter.post(
    "/addUsersToEvent",
    async (req: Request<{}, {}, IAddUsersToEventPayload>, res) => {
        const data = await eventController.addUsersToEvent(req.body);
        res.status(200).json({data});
    },
);

EventRouter.post(
    "/removeUsersFromEvent",
    async (req: Request<{}, {}, IRemoveUsersFromEventPayload>, res) => {
        const data = await eventController.removeUsersFromEvent(req.body);
        res.status(200).json({data});
    },
);
