export abstract class GetManyDTO<T> {
  data: T[];

  protected constructor(data: T[]) {
    this.data = data;
  }
}
