import { body, param, query } from "express-validator";
import { validateHandler } from "./index.js";

const formIdParam = param("formId")
    .trim()
    .notEmpty()
    .withMessage("formId is required")
    .isUUID()
    .withMessage("formId must be a valid UUID");

const versionQuery = query("version")
    .optional()
    .isInt({ min: 1 })
    .withMessage("version must be a positive integer")
    .toInt();

const submissionFilterRules = [
    versionQuery,

    query("fromDate")
        .optional()
        .isISO8601()
        .withMessage("fromDate must be a valid ISO 8601 date"),

    query("toDate")
        .optional()
        .isISO8601()
        .withMessage("toDate must be a valid ISO 8601 date"),

    query("sortBy")
        .optional()
        .matches(/^created_at:(asc|desc)$/i)
        .withMessage("sortBy must be 'created_at:asc' or 'created_at:desc'"),

    
];

export const submitFormValidator = [
    formIdParam,

    body("answers")
        .notEmpty()
        .withMessage("answers is required")
        .isObject()
        .withMessage("answers must be an object"),

    validateHandler,
];

export const getResponseValidator = [
    formIdParam,

    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("page must be a positive integer")
        .toInt(),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("limit must be between 1 and 100")
        .toInt(),

    ...submissionFilterRules,

    validateHandler,
];


export const exportCSVValidator = [
    formIdParam,
    ...submissionFilterRules,
    validateHandler,
];
