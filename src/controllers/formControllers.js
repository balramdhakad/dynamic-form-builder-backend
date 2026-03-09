import formServices from "../services/formService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateFormSchema } from "../validator/formSchemaValidator.js";

export const createFormSchemaController = asyncHandler(async (req, res) => {
  const { title, description, schema } = req.body;
  const userId = req.user.id;

  await validateFormSchema(schema);


  const result = await formServices.createFormSchema(
    title,
    description,
    schema,
    userId,
  );

  res.status(201).json({
    message: "Form Schema created successfully",
    data: result,
  });
});

//get Single Form by Id
export const getFormByIdController = asyncHandler(async (req, res) => {
  const { formId } = req.params;


  const result = await formServices.getFormById(formId);

  res.status(200).json({
    message: "Form Schema retrieved successfully",
    data: result,
  });
});

//get all forms with pagination, filtering and sorting
export const getAllFormsController = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    fromDate,
    toDate,
    title,
    description,
  } = req.query;

  const { result, pagination } = await formServices.getAllForms({
    page,
    limit,
    fromDate,
    toDate,
    title,
    description,
  });

  res.status(200).json({
    message: "Form Schema retrieved successfully",
    pagination: pagination,
    data: result,
  });
});

export const updateFormSchemaController = asyncHandler(async (req, res) => {
  const { formId } = req.params;
  const { title, description, schema } = req.body;
  const userId = req.user.id;

  if (schema) {
     await validateFormSchema(schema);
  }

  const updatedForm = await formServices.updateForm(
    formId,
    { title, description, schema },
    userId,
  );

  res.status(200).json({
    message: "Form updated successfully",
    data: updatedForm,
  });
});

export const deleteFormController = asyncHandler(async (req, res) => {
  const { formId } = req.params;

  await formServices.deleteForm(formId);
  res.status(200).json({
    message: "Form deleted successfully",
  });
});
