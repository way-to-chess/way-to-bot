import { inject, injectable } from "inversify";
import { AdminFileService } from "@way-to-bot/server/admin/services/file.service.mjs";
import { EFileAssigment } from "@way-to-bot/shared/api/enums/index.js";
import { BadRequestError } from "@way-to-bot/server/common/errors/bad-request.error.mjs";
import { AdminDTOFileImportCsvResponse } from "@way-to-bot/shared/api/DTO/admin/file.DTO.js";
import { Request, Response } from "express";

@injectable()
export class AdminFileController {
  constructor(
    @inject(AdminFileService) private readonly _fileService: AdminFileService,
  ) {}

  async importCsv(req: Request, res: Response) {
    const elId = +req.params.eventLeagueId!;
    const assigment = req.body.assigment;
    const file = req.file;

    switch (assigment) {
      case EFileAssigment.ROUNDS_CSV:
        await this._fileService.importRoundsCsv(elId, file);
        break;
      case EFileAssigment.RATING_CSV:
        await this._fileService.importRatingCsv(elId, file);
        break;
      default:
        throw new BadRequestError(
          `Unknown assigment type for import. "${assigment}"`,
        );
    }

    const data = new AdminDTOFileImportCsvResponse(true);
    res.status(200).send(data);
  }
}
