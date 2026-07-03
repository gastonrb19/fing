export class GeneralError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(message: string, statusCode = 500, code = "SVR_ERR") {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class NotFoundError extends GeneralError {
  constructor(resourceName: string, idValue: number) {
    super(
      `Resource "(${resourceName})" not found with id "(${idValue})"`,
      404,
      "NOT_FOUND",
    );
  }
}
