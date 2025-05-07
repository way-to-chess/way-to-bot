export abstract class GetOneDTO<T> {
  data: T;

  protected constructor(data: T) {
    this.data = data;
  }
}
