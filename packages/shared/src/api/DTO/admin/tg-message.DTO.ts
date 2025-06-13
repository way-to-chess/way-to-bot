import { BaseDTOTgMessage } from "../base/tg-message.DTO";
import { GetOneDTO } from "../common/get-one.DTO";

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
