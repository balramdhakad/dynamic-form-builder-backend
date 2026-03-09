import { BadRequestError } from "./errors.js";

export const orderByFilter = (sortBy) => {
  let orderBy;
  
  if(!sortBy) {
    return orderBy = `ORDER BY created_at DESC`
  }
  const allowedFields = ["created_at", "title", "version"];
  const [field, order] = sortBy.split(":");
  if (!allowedFields.includes(field)) {
    throw new BadRequestError("Invalid sort field");
  }
  if (order && !["asc", "desc"].includes(order.toLowerCase())) {
    throw new BadRequestError("Invalid sort order");
  }

  if (field && order) {
    orderBy = `ORDER BY ${field} ${order}`;
  } else {
    orderBy = `ORDER BY created_at DESC`;
  }
  return orderBy;
};
