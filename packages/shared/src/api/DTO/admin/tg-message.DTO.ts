import { BaseDTOTgMessage } from "@way-to-bot/shared/api/DTO/base/tg-message.DTO.js";
import { GetOneDTO } from "@way-to-bot/shared/api/DTO/common/get-one.DTO.js";

// response DTO
export class AdminDTOTgMessageResponse extends GetOneDTO<AdminDTOTgMessage> {
  constructor(data: AdminDTOTgMessage) {
    super(data);
  }
}

// returning data DTO
export class AdminDTOTgMessage extends BaseDTOTgMessage {
  constructor(data: { successListIds: number[]; failedListIds: number[] }) {
    super(data);
  }
}
