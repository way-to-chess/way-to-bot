export class AuthDTO {
  data: { id: number; token: string };
  constructor(id: number, token: string) {
    this.data = {
      id,
      token: `Bearer ${token}`,
    };
  }
}
