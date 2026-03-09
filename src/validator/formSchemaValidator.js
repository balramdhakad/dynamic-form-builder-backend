import ajv from "../config/ajv.js";
import { ValidationError } from "../utils/errors.js";
import { formatAjvErrors } from "../utils/formatAjvErrors.js";

export const formSchemaDefinition = {
  type: "object",
  required: ["fields"],
  properties: {
    fields: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        required: ["id", "label", "type"],
        properties: {
          id: { type: "string", minLength: 1 },
          label: { type: "string", minLength: 1 },

          type: {
            type: "string",
            enum: ["Text", "Number", "Email", "Date", "Dropdown", "Checkbox"],
          },

          required: { type: "boolean" },

          options: {
            type: "array",
            items: { type: "string" },
          },

          validation: {
            type: "object",
            properties: {
              minLength: { type: "integer", minimum: 0 },
              maxLength: { type: "integer", minimum: 0 },
              pattern: { type: "string" },
              minimum: { type: "number" },
              maximum: { type: "number" },

              minItems: { type: "integer", minimum: 0 },
              maxItems: { type: "integer", minimum: 0 },

              format: {
                type: "string",
                enum: ["email", "date", "uri"],
              },

              const: {},
            },
            additionalProperties: false,
          },
        },

        if: {
          properties: {
            type: { enum: ["Dropdown", "Checkbox"] },
          },
          required: ["type"],
        },
        then: {
          required: ["options"],
          properties: {
            options: {
              type: "array",
              minItems: 1,
              items: { type: "string" },
            },
          },
        },
      },
    },
  },
};

const validate = ajv.compile(formSchemaDefinition);

export const validateFormSchema = (schema) => {
  const valid = validate(schema);

  if (!valid) {
    const details = formatAjvErrors(validate.errors);
    throw new ValidationError("Form schema validation failed", details);
  }

  return true;
};
