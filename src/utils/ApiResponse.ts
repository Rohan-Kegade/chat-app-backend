export class ApiResponse<T> {
  public success: boolean;
  public statusCode: number;
  public message: string;
  public data?: T;

  constructor(statusCode: number, message: string, data?: T) {
    this.success = statusCode < 400; // true for 2xx/3xx, false otherwise
    this.statusCode = statusCode;
    this.message = message;
    if (data !== undefined) this.data = data;
  }
}
