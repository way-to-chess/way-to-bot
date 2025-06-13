export abstract class BaseDTOTgMessage {
  successListIds: number[];
  failedListIds: number[];

  constructor(data: { successListIds: number[]; failedListIds: number[] }) {
    this.successListIds = data.successListIds;
    this.failedListIds = data.failedListIds;
  }
}
