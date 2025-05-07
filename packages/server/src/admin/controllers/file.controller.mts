import { inject, injectable } from "inversify";
import { AdminFileService } from "@way-to-bot/server/admin/services/file.service.mjs";

@injectable()
export class AdminFileController {
  constructor(
    @inject(AdminFileService) private readonly _fileService: AdminFileService,
  ) {}
}
