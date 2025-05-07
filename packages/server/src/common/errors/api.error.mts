export abstract class ApiError extends Error {
  public readonly status: number;
  public readonly code?: string;
  public readonly details?: Record<string, any>;

  protected constructor(
    message: string,
    status: number = 500,
    code?: string,
    details?: Record<string, any>,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.code = code;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      message: this.message,
      code: this.code,
      details: this.details,
    };
  }
}
