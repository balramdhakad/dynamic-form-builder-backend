import { pool } from "../db/connection.js";

const createSubmission = async (formVersionId, formId, answer, userId) => {
  const query = `
    INSERT INTO submissions (form_version_id, form_id, data, submitted_by)
    VALUES ($1, $2, $3, $4)
    RETURNING id, form_version_id, form_id, data, submitted_by, created_at;
  `;
  const result = await pool.query(query, [formVersionId, formId, answer, userId]);
  return result.rows[0] || null;
};


const getResponsePaginated = async ({ where, params, orderBy, limit, offset }) => {
  const query = `
    SELECT id, form_version_id, form_id, data, submitted_by, created_at
    FROM submissions
    WHERE ${where.join(" AND ")}
    ${orderBy}
    LIMIT $${params.length + 1} OFFSET $${params.length + 2}
  `;

  const result = await pool.query(query, [...params, limit, offset]);
  return result.rows;
};


const getTotalSubmissionsCount = async ({ where, params }) => {
  const query = `
    SELECT COUNT(*) AS total
    FROM submissions
    WHERE ${where.join(" AND ")}
  `;

  const result = await pool.query(query, params);
  return Number(result.rows[0].total);
};


const getResponseFiltered = async ({ where, params, orderBy }) => {
  const query = `
    SELECT id, form_version_id, form_id, data, submitted_by, created_at
    FROM submissions
    WHERE ${where.join(" AND ")}
    ${orderBy}
  `;

  const result = await pool.query(query, params);
  return result.rows;
};

const submissionRepository = {
  createSubmission,
  getResponsePaginated,
  getTotalSubmissionsCount,
  getResponseFiltered,
};

export default submissionRepository;
