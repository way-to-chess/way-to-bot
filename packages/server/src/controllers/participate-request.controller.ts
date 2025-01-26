import { Body, Delete, Get, Path, Post, Put, Route, Tags } from "tsoa";
import { ParticipateRequestService } from "../services/participate-request.service";
import {
  IParticipantRequestDeletePayload,
  IParticipateRequestCreatePayload,
  IParticipateRequestUpdatePayload,
} from "../interfaces/participate-request.interface";

@Route("/api/participateRequest")
@Tags("Participate requests")
export class ParticipateRequestController {
  private participateRequestService = new ParticipateRequestService();

  @Get("/all")
  async getAllParticipateRequests() {
    return this.participateRequestService.getAllParticipateRequests();
  }

  @Get("/getById/{id}")
  async getParticipateRequestById(@Path() id: number) {
    return this.participateRequestService.getParticipateRequestById(id);
  }

  @Post("/create")
  async createParticipateRequest(
    @Body() payload: IParticipateRequestCreatePayload,
  ) {
    return this.participateRequestService.createParticipateRequest(payload);
  }

  @Put("/update")
  async updateParticipateRequest(
    @Body() payload: IParticipateRequestUpdatePayload,
  ) {
    return this.participateRequestService.updateParticipateRequest(payload);
  }

  @Delete("/delete")
  async deleteParticipateRequest(
    @Body() payload: IParticipantRequestDeletePayload,
  ) {
    return this.participateRequestService.deleteParticipateRequest(payload);
  }
}
