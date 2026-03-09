import submissionServer from "../services/submissionService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const responseSubmit = asyncHandler(async (req, res) => {
  const { answers } = req.body;
  const { formId } = req.params;
  const userId = req.user.id;

  await submissionServer.submitForm(formId, answers, userId);

  res.status(201).json({
    message: "Response submitted successfully",
  });
});

export const getResponse = asyncHandler(async (req, res) => {
  const { formId } = req.params;
  const { version = null, page = 1, limit = 10, fromDate, toDate, sortBy } = req.query;

  const { result, pagination } = await submissionServer.getResponse(
    formId,
    version,
    { page, limit, fromDate, toDate, sortBy },
  );

  res.status(200).json({
    message: "Responses retrieved successfully",
    pagination,
    data: result,
  });
});

export const getResponseInCSV = asyncHandler(async (req, res) => {
  const { formId } = req.params;
  const { version = null, fromDate, toDate, sortBy } = req.query;

  const csv = await submissionServer.exportFormResponses(
    formId,
    version,
    { fromDate, toDate, sortBy },
  );

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename=form-${formId}-responses.csv`);
  res.status(200).send(csv);
});
