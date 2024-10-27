import {Body, Delete, Get, Path, Post, Put, Route, Tags} from "tsoa";
import { LocationService } from "../services/location.service";
import {
  ILocationCreatePayload,
  ILocationDeletePayload,
  ILocationUpdatePayload,
} from "@way-to-bot/shared/src/interfaces/location.interface";

@Route("/api/location")
@Tags("Locations")
export class LocationController {
  private locationService = new LocationService();

  @Get("/all")
  async getAllLocations() {
    return this.locationService.getAllLocations();
  }

  @Get("/getById/{id}")
  async getLocationById(@Path() id: number) {
    return this.locationService.getLocationById(id);
  }

  @Post("/create")
  async createLocation(@Body() payload: ILocationCreatePayload) {
    return this.locationService.createLocation(payload);
  }

  @Put("/update")
  async updateLocation(@Body() payload: ILocationUpdatePayload) {
    return this.locationService.updateLocation(payload);
  }

  @Delete("/delete")
  async deleteLocation(@Body() payload: ILocationDeletePayload) {
    return this.locationService.deleteLocation(payload);
  }
}
