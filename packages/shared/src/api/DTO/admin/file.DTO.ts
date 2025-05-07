import { BaseDTOFile } from "@way-to-bot/shared/api/DTO/base/file.DTO.js";
import { IFileEntity } from "@way-to-bot/shared/api/interfaces/entities/file-entity.interface.js";
import { GetOneDTO } from "@way-to-bot/shared/api/DTO/common/get-one.DTO.js";
import { DeleteDTO } from "@way-to-bot/shared/api/DTO/common/delete.DTO.js";

// response DTO
export class AdminDTOFileCreateResponse extends GetOneDTO<AdminDTOFileGetOne> {
  constructor(data: AdminDTOFileGetOne) {
    super(data);
  }
}

export class AdminDTOFileDeleteResponse extends DeleteDTO {
  constructor(data: boolean) {
    super(data);
  }
}

// returning data DTO
export class AdminDTOFileGetOne extends BaseDTOFile {
  constructor(data: IFileEntity) {
    super(data);
  }
}
