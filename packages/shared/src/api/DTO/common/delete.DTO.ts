export abstract class DeleteDTO {
  data: boolean;

  protected constructor(data: boolean) {
    this.data = data;
  }
}
