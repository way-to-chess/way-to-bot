import { inject, injectable } from "inversify";
import { AdminFileService } from "@way-to-bot/server/admin/services/file.service";
import { BadRequestError } from "@way-to-bot/server/common/errors/bad-request.error";
import { AdminDTOFileImportCsvResponse } from "@way-to-bot/shared/api/DTO/admin/file.DTO";
import { Request, Response } from "express";
import { EFileAssigment } from "@way-to-bot/shared/api/enums/EFileAssigment";

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
      case EFileAssigment.SS_SCV:
        await this._fileService.importSS(elId, file);
        break;
      case EFileAssigment.CR_SCV:
        await this._fileService.importCR(elId, file);
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
