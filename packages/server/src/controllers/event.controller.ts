import { Body, Delete, Get, Path, Post, Put, Route, Tags } from "tsoa";
import { EventService } from "packages/server/src/services/event.service";
import {
  IAddUsersToEventPayload,
  IEventCreatePayload,
  IEventDeletePayload,
  IEventUpdatePayload,
  IRemoveUsersFromEventPayload,
} from "packages/shared/src/interfaces/event.interface";

@Route("/api/event")
@Tags("Events")
export class EventController {
  private eventService = new EventService();

  @Get("/all")
  async getAllEvents() {
    return this.eventService.getAllEvents();
  }

  @Get("/getById/{id}")
  async getEventById(@Path() id: number) {
    return this.eventService.getEventById(id);
  }

  @Post("/create")
  async createEvent(@Body() payload: IEventCreatePayload) {
    return this.eventService.createEvent(payload);
  }

  @Put("/update")
  async updateEvent(@Body() payload: IEventUpdatePayload) {
    return this.eventService.updateEvent(payload);
  }

  @Delete("/delete")
  async deleteEvent(@Body() payload: IEventDeletePayload) {
    return this.eventService.deleteEvent(payload);
  }

  @Post("/addUsersToEvent")
  async addUsersToEvent(@Body() payload: IAddUsersToEventPayload) {
    return this.eventService.addUsersToEvent(payload);
  }

  @Delete("/removeUsersFromEvent")
  async removeUsersFromEvent(@Body() payload: IRemoveUsersFromEventPayload) {
    return this.eventService.removeUsersFromEvent(payload);
  }
}
