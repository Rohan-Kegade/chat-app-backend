export class ApiResponse<T> {
  public success: boolean;
  public message: string;
  public data: T;
  public token?: string;

  constructor(success: boolean, message: string, data: T, token?: string) {
    this.success = success;
    this.data = data;
    this.message = message;
    if (token) this.token = token;
  }
}
