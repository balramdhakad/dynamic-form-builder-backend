import { BadRequestError } from "./errors.js";


const parseDate = (dateStr, params) => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new BadRequestError(`Invalid date format for ${params}`);
  }
  return date;
}

export const dateFilter = (whereClauses, queryParams, fromDate, toDate) => {
  let start;
  let end;
  if (!fromDate && !toDate) {
    return { whereClauses, queryParams }
  }

  if (fromDate) {
    start = parseDate(fromDate, "fromDate");
  }

  if (toDate) {
    end = parseDate(toDate, "toDate");
  }

  if (fromDate && toDate && start > end) {
    throw new BadRequestError("fromDate cannot be greater than toDate");
  }

  if (fromDate) {
    whereClauses.push(`created_at >= $${queryParams.length + 1}`);
    queryParams.push(start);
  }
  if (toDate) {
    whereClauses.push(`created_at <= $${queryParams.length + 1}`);
    queryParams.push(end);
  }

  return { whereClauses, queryParams };
};


