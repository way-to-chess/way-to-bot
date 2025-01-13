import { Body, Delete, Get, Path, Post, Put, Route, Tags } from "tsoa";
import { ParticipateRequestService } from "../services/participate-request.service";
import {
  IParticipantRequestDeletePayload,
  IParticipateRequestCreatePayload,
  IParticipateRequestUpdatePayload,
} from "../interfaces/participate-request.interface";

@Route("/api/participateRequest")
@Tags("ParticipateRequests")
export class ParticipateRequestController {
  private participateRequestService = new ParticipateRequestService();

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
