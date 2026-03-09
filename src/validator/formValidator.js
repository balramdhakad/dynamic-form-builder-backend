import { body, param, query } from "express-validator";
import { validateHandler } from "./index.js";


const formIdParam = param("formId")
    .trim()
    .notEmpty()
    .withMessage("formId is required")
    .isUUID()
    .withMessage("formId must be a valid UUID");


export const createFormValidator = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("title is required")
        .isString()
        .withMessage("title must be a string")
        .isLength({ min: 3, max: 255 })
        .withMessage("title must be between 3 and 255 characters"),

    body("description")
        .optional()
        .trim()
        .isString()
        .withMessage("description must be a string")
        .isLength({ max: 1000 })
        .withMessage("description must be at most 1000 characters"),

    body("schema")
        .notEmpty()
        .withMessage("schema is required")
        .isObject()
        .withMessage("schema must be an object"),

    body("schema.fields")
        .isArray({ min: 1 })
        .withMessage("schema.fields must be a non-empty array"),

    validateHandler,
];

export const getAllFormsValidator = [
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

    query("fromDate")
        .optional()
        .isISO8601()
        .withMessage("fromDate must be a valid ISO 8601 date (e.g. 2024-01-01)"),

    query("toDate")
        .optional()
        .isISO8601()
        .withMessage("toDate must be a valid ISO 8601 date (e.g. 2024-12-31)"),

    query("title")
        .optional()
        .trim()
        .isString()
        .withMessage("title must be a string")
        .isLength({ max: 255 })
        .withMessage("title must be at most 255 characters"),

    query("description")
        .optional()
        .trim()
        .isString()
        .withMessage("description must be a string")
        .isLength({ max: 1000 })
        .withMessage("description must be at most 1000 characters"),

    validateHandler,
];


export const getFormByIdValidator = [formIdParam, validateHandler];

export const updateFormValidator = [
    formIdParam,

    body().custom((_, { req }) => {
        const { title, description, schema } = req.body;
        if (title === undefined && description === undefined && schema === undefined) {
            throw new Error("At least one of title, description, or schema must be provided");
        }
        return true;
    }),

    body("title")
        .optional()
        .trim()
        .isString()
        .withMessage("title must be a string")
        .isLength({ min: 3, max: 255 })
        .withMessage("title must be between 3 and 255 characters"),

    body("description")
        .optional()
        .trim()
        .isString()
        .withMessage("description must be a string")
        .isLength({ max: 1000 })
        .withMessage("description must be at most 1000 characters"),

    body("schema")
        .optional()
        .isObject()
        .withMessage("schema must be an object"),

    body("schema.fields")
        .optional()
        .isArray({ min: 1 })
        .withMessage("schema.fields must be a non-empty array"),

    validateHandler,
];


export const deleteFormValidator = [formIdParam, validateHandler];
