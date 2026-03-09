import { BadRequestError } from "./errors.js";

export const buildSubmissionSchema = (formSchema) => {

  const properties = {};
  const required = [];

  for (const field of formSchema.fields) {

    const rules = field.validation || {};

    let schema = {};

    switch (field.type) {

      case "Text":
        schema = {
          type: "string",
          ...rules
        };
        break;

      case "Number":
        schema = {
          type: "number",
          ...rules
        };
        break;

      case "Email":
        schema = {
          type: "string",
          format: "email"
        };
        break;

      case "Date":
        schema = {
          type: "string",
          format: "date"
        };
        break;

      case "Dropdown":
        schema = {
          type: "string",
          enum: field.options
        };
        break;

      case "Checkbox":
        schema = {
          type: "array",
          items: {
            type: "string",
            enum: field.options
          },
          ...rules
        };
        break;

      default:
        throw new BadRequestError(`Unsupported field type: "${field.type}"`)
    }

    properties[field.id] = schema;

    if (field.required) {
      required.push(field.id);
    }
  }

  return {
    type: "object",
    properties,
    required,
    additionalProperties: false
  };
}; 