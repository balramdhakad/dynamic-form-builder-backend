import { pool } from "../db/connection.js";

const createFormSchema = async (formData, client = pool) => {
  const query = `
    INSERT INTO forms (form_id,title, description, schema, created_by,version)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, title,form_id, description, schema, created_by, created_at,version;
  `;
  const result = await client.query(query, [
    formData.formId,
    formData.title,
    formData.description,
    formData.schema,
    formData.userId,
    formData.version || 1,
  ]);

  return result.rows[0] || null;
};

const getAllForms = async (options) => {
  const { where, params, orderBy, offset, limit } = options;

  let query = `
    SELECT id, form_id, title, description, schema, version, created_at
    FROM forms
  `;

  if (where.length > 0) {
    query += ` WHERE ${where.join(" AND ")}`;
  }

  if (orderBy) {
    query += ` ${orderBy}`;
  }

  query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;

  const finalParams = [...params, limit, offset];

  const result = await pool.query(query, finalParams);

  return result.rows;
};

const getTotalCount = async (options) => {
  const { where, params } = options;

  let query = `
    SELECT COUNT(*) AS total
    FROM forms
  `;

  if (where.length > 0) {
    query += ` WHERE ${where.join(" AND ")}`;
  }

  const result = await pool.query(query, params);

  return Number(result.rows[0].total);
};

const getActiveFormByFormId = async (formId) => {
  const query = `
    SELECT id, form_id, title, description, schema, version
    FROM forms
    WHERE form_id = $1 AND is_active = true AND is_deleted = false

  `;
  const result = await pool.query(query, [formId]);
  return result.rows[0] || null;
};

const getFormByVersionId = async (formId, version) => {
  const query = `
    SELECT id, form_id, title, description, schema, created_by, created_at, version
    FROM forms
    WHERE form_id = $1 AND version = $2 AND is_deleted = false
    LIMIT 1;
  `;
  const result = await pool.query(query, [formId, version]);
  return result.rows[0] || null;
};

const updateFormStatusToInactive = async (formId, client = pool) => {
  const query = `
    UPDATE forms
    SET is_active = false, updated_at = NOW()
    WHERE form_id = $1
    AND is_active = true
    AND is_deleted = false
  `;

  const result = await client.query(query, [formId]);

  return result.rowCount;
};

const getActiveFormForUpdate = async (formId, client = pool) => {
  const query = `
    SELECT id, form_id, title, description, schema, version
    FROM forms
    WHERE form_id = $1 AND is_active = true AND is_deleted = false
    LIMIT 1
    FOR UPDATE;
  `;
  const result = await client.query(query, [formId]);
  return result.rows[0] || null;
};

const softDeleteForm = async (formId) => {
  const query = `
  UPDATE forms
  SET is_deleted = true, updated_at = NOW(), is_active = false
  WHERE form_id = $1
  AND is_deleted = false
  RETURNING *;
  `;
  const result = await pool.query(query, [formId]);
  return result.rows || null;
};

const formRepository = {
  createFormSchema,
  getAllForms,
  getActiveFormByFormId,
  getActiveFormForUpdate,
  getTotalCount,
  updateFormStatusToInactive,
  getFormByVersionId,
  softDeleteForm,
};

export default formRepository;
