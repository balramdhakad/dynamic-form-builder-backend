import formRepository from "../repositories/formRepositories.js";
import submissionRepository from "../repositories/submissionRepositories.js";
import {  NotFoundError } from "../utils/errors.js";
import { validateSubmission } from "../validator/submissionValidator.js";
import { dateFilter } from "../utils/dateFilter.js";
import { orderByFilter } from "../utils/orderByFilter.js";
import { Parser } from "json2csv";

const submitForm = async (formId, answers, userId) => {
  const form = await formRepository.getActiveFormByFormId(formId);

  if (!form) {
    throw new NotFoundError("Form not found");
  }

  //Validate submission answers against form schema
  await validateSubmission(form.schema, answers);

  const result = await submissionRepository.createSubmission(
    form.id,
    formId,
    answers,
    userId,
  );

  return result;
};

const buildQueryOptions = (formVersionId, raw = {}) => {
  const { page = 1, limit = 10, fromDate, toDate, sortBy } = raw;

  let whereClauses = [`form_version_id = $1`];
  let queryParams = [formVersionId];

  // Date Filtering
  if (fromDate || toDate) {
    const result = dateFilter(whereClauses, queryParams, fromDate, toDate);
    whereClauses = result.whereClauses;
    queryParams = result.queryParams;
  }

  // sortBy order filtering
  const orderBy = orderByFilter(sortBy);

  return {
    where: whereClauses,
    params: queryParams,
    orderBy,
    page: Number(page),
    limit: Number(limit),
  };
};

const getResponse = async (formId, version, rawOptions = {}) => {
  const form = version
    ? await formRepository.getFormByVersionId(formId, version)
    : await formRepository.getActiveFormByFormId(formId);

  if (!form) {
    throw new NotFoundError("Form not found");
  }

  //build Query options for filtering, sorting 
  const options = buildQueryOptions(form.id, rawOptions);
  const offset = (options.page - 1) * options.limit;

  const [submissions, total] = await Promise.all([
    submissionRepository.getResponsePaginated({ ...options, offset }),
    submissionRepository.getTotalSubmissionsCount(options),
  ]);

  const pagination = {
    total,
    page: options.page,
    limit: options.limit,
    totalPages: Math.ceil(total / options.limit),
  };

  return {
    result: { schema: form.schema, responses: submissions },
    pagination,
  };
};

const exportFormResponses = async (formId, version, rawOptions = {}) => {
  const form = version
    ? await formRepository.getFormByVersionId(formId, version)
    : await formRepository.getActiveFormByFormId(formId);

  if (!form) {
    throw new NotFoundError("Form not found");
  }

  const options = buildQueryOptions(form.id, rawOptions);
  const fields = form.schema.fields.map((f) => f.id);
  const submissions = await submissionRepository.getResponseFiltered(options);
  const data = submissions.map((s) => s.data);

  const parser = new Parser({ fields });
  return parser.parse(data);
};

const submissionServer = { submitForm, getResponse, exportFormResponses };
export default submissionServer;
