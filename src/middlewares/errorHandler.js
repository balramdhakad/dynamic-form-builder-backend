import env from "../config/env.js";
import { logger } from "../config/logger.js";
import { identifyPostgresErrors } from "../utils/postgresErrors.js";

export const errorHandler = (err, req, res, next) => {
  err = identifyPostgresErrors(err);

  const isProduction = env.serverConfig.environment === "production";
  const isOperational = err.isOperational === true;

  let statusCode =
    err.statusCode && typeof err.statusCode === "number" && err.statusCode > 399
      ? err.statusCode
      : 500;

  let response = {
    success: false,
    message:
      isProduction && !isOperational
        ? "Something went wrong"
        : err.message || "internal server error",
    code: err.errorCode || "INTERNAL_SERVER_ERROR",
    timestamp: new Date().toISOString(),
  };

  if (err.details) {
    response.details = err.details;
  }

  if (!isProduction) {
    response.stack = err.stack;
  }

  const structuredLogData = {
    message: err.message,
    errorCode: err.errorCode || "UNEXPECTED_ERROR",
    statusCode,
    correlationId: req.correlationId || null,
    method: req.method,
    url: req.originalUrl,
    stack: err.stack,
  };

  if (statusCode >= 500) {
    logger.error(structuredLogData);
  } else {
    logger.warn(structuredLogData);
  }

  res.status(statusCode).json(response);
};
