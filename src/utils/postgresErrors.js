import { BadRequestError, ConflictError } from "./errors.js";

export const identifyPostgresErrors = (err) => {
  if (!err || !err.code) return err;

  switch (err.code) {
    case "23505":
      return new ConflictError("Duplicate value violates unique constraint");

    case "23503":
      return new BadRequestError("Invalid reference (foreign key violation)");

    case "23502":
      return new BadRequestError("Missing required field");

    default:
      return err;
  }
};
