import { Body, Delete, Get, Path, Post, Put, Route, Tags } from "tsoa";
import { ParticipateRequestService } from "../services/participate-request.service";
import {
  IParticipantRequestDeletePayload,
  IParticipateRequestApprovePayload,
  IParticipateRequestCreatePayload,
  IParticipateRequestUpdatePayload,
} from "../interfaces/participate-request.interface";
import { dbInstance } from "../database/init";

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

  @Post("/approve")
  async approveParticipateRequest(
    @Body() payload: IParticipateRequestApprovePayload,
  ) {
    return dbInstance.transaction(async (transaction) => {
      const participateRequestService = new ParticipateRequestService(
        transaction,
      );
      return participateRequestService.approveParticipateRequest(payload);
    });
  }

  @Delete("/delete")
  async deleteParticipateRequest(
    @Body() payload: IParticipantRequestDeletePayload,
  ) {
    return this.participateRequestService.deleteParticipateRequest(payload);
  }
}
