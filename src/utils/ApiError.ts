export class ApiError extends Error {
  public statusCode: number;
  public errors?: any[];
  public stackTrace?: string | undefined;

  constructor(statusCode: number, message: string, errors: any[] = [], stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.stackTrace = stack ? stack : new Error().stack;
  }
}
