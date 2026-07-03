import { ErrorRequestHandler } from "express";
import { QueryFailedError } from "typeorm";
import { GeneralError } from "../utils/classError.js";

interface NormalizedError {
  statusCode: number;
  code: string;
  message: string;
}

// Error crudo del driver de Postgres que expone TypeORM en QueryFailedError
interface DriverError {
  code?: string;
  detail?: string;
}

const printError = (err: unknown): void => {
  console.error("---------------- ERROR ----------------");
  console.error(err);
  console.error("---------------------------------------");
};

const normalizeError = (err: unknown): NormalizedError => {
  // Errores propios (GeneralError y sus derivados, ej. NotFoundError)
  if (err instanceof GeneralError) {
    return {
      statusCode: err.statusCode,
      code: err.code,
      message: err.message,
    };
  }

  // Errores de constraint de Postgres (a traves de TypeORM)
  if (err instanceof QueryFailedError) {
    const driverError = (err as unknown as { driverError?: DriverError }).driverError;

    switch (driverError?.code) {
      case "23505": // unique_violation
        return {
          statusCode: 400,
          code: "VL_UNI",
          message: driverError.detail ?? "Unique constraint violation",
        };
      case "23503": // foreign_key_violation
        return {
          statusCode: 400,
          code: "NOT_FK",
          message: driverError.detail ?? "Foreign key referenced doesn't exist",
        };
    }
  }

  // Fallback: error no controlado
  return {
    statusCode: 500,
    code: "SVR_ERR",
    message: err instanceof Error ? err.message : "SERVER ERROR",
  };
};

// 1) Loguea el error y lo pasa al siguiente handler
export const logError: ErrorRequestHandler = (err, _req, _res, next) => {
  printError(err);
  next(err);
};

// 2) Traduce el error a una respuesta JSON consistente
export const handleError: ErrorRequestHandler = (err, _req, res, _next) => {
  const { statusCode, code, message } = normalizeError(err);

  res.status(statusCode).json({
    success: false,
    error: { message, code },
  });
};
