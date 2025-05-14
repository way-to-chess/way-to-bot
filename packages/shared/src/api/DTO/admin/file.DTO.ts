import { GetOneDTO } from "@way-to-bot/shared/api/DTO/common/get-one.DTO.js";

// response DTO
export class AdminDTOFileImportCsvResponse extends GetOneDTO<boolean> {
  constructor(data: boolean) {
    super(data);
  }
}
