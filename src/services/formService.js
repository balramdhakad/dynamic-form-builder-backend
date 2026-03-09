import { v7 as uuid } from "uuid";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "../utils/errors.js";
import { orderByFilter } from "../utils/orderByFilter.js";
import formRepository from "../repositories/formRepositories.js";
import { pool } from "../db/connection.js";
import { dateFilter } from "../utils/dateFilter.js";

//create Form
const createFormSchema = async (title, description, schema, userId) => {
  //genrate random unique form id
  const formId = uuid();

  const result = await formRepository.createFormSchema({
    formId,
    title,
    description,
    schema,
    userId,
  });

  if (!result) {
    throw new InternalServerError("Failed to create form schema");
  }

  return result;
};

//get ALL forms with pagination, filtering and sorting
const getAllForms = async (options) => {
  const { page = 1, limit = 10, sortBy, fromDate, toDate, title, description } = options;

  let whereClauses = [`is_active = $1`, `is_deleted = $2`];
  let queryParams = [true, false];

  const offset = (page - 1) * limit;

  if (fromDate || toDate) {
    const result = dateFilter(whereClauses, queryParams, fromDate, toDate);
    whereClauses = result.whereClauses;
    queryParams = result.queryParams;
  }
  
  if (title) {
    whereClauses.push(`title ILIKE $${queryParams.length + 1}`);
    queryParams.push(`%${title}%`);
  }

  if (description) {
    whereClauses.push(`description ILIKE $${queryParams.length + 1}`);
    queryParams.push(`%${description}%`);
  }

  const orderBy = orderByFilter(sortBy);

  const [total, result] = await Promise.all([
    formRepository.getTotalCount({
      where: whereClauses,
      params: queryParams,
    }),
    formRepository.getAllForms({
      where: whereClauses,
      params: queryParams,
      orderBy,
      offset,
      limit,
    }),
  ]);

  const pagination = {
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit),
  };

  return { result, pagination };
};


const getFormById = async (formId) => {
  const result = await formRepository.getActiveFormByFormId(formId);
  if (!result) {
    throw new NotFoundError("Form not found");
  }
  return result;
};

const updateForm = async (formId, data, userId) => {
  const { title, description, schema } = data;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const activeVersion = await formRepository.getActiveFormForUpdate(
      formId,
      client,
    );

    if (!activeVersion) {
      throw new NotFoundError("Form not found");
    }

    const updatedTitle = title ?? activeVersion.title;
    const updatedDescription = description ?? activeVersion.description;
    const updatedSchema = schema ?? activeVersion.schema;

    if(updatedTitle === activeVersion.title && updatedDescription === activeVersion.description && JSON.stringify(updatedSchema) === JSON.stringify(activeVersion.schema)) {
      throw new BadRequestError("No changes detected in the form data");
    }

    const newVersion = activeVersion.version + 1;

    const deactivatedForms = await formRepository.updateFormStatusToInactive(
      formId,
      client,
    );

    if (deactivatedForms === 0) {
      throw new InternalServerError("Failed to deactivate old form version");
    }

    const updatedForm = await formRepository.createFormSchema(
      {
        formId: activeVersion.form_id,
        title: updatedTitle,
        description: updatedDescription,
        schema: updatedSchema,
        userId,
        version: newVersion,
      },
      client,
    );

    if (!updatedForm) {
      throw new InternalServerError("Failed to update form schema");
    }

    await client.query("COMMIT");

    return updatedForm;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const deleteForm = async (formId) => {
  const deletedForm = await formRepository.softDeleteForm(formId);

  if (deletedForm.length === 0) {
    throw new NotFoundError("Form not found to delete");
  }

  return deletedForm;
};

const formServices = {
  createFormSchema,
  updateForm,
  getAllForms,
  deleteForm,
  getFormById,
};
export default formServices;
