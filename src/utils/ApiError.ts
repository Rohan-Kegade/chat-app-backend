export class ApiError extends Error {
  public statusCode: number;
  public errors: any[];

  constructor(
    statusCode: number,
    message: string = "Something went wrong!",
    errors: any[] = [],
    stack?: string
  ) {
    super(message);

    this.statusCode = statusCode;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
