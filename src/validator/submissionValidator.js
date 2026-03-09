import ajv from "../config/ajv.js";
import { buildSubmissionSchema } from "../utils/buildSubmissionSchema.js";
import { ValidationError } from "../utils/errors.js";
import { formatAjvErrors } from "../utils/formatAjvErrors.js";

export const validateSubmission = (formSchema, answers) => {

  const submissionSchema = buildSubmissionSchema(formSchema);

  const validate = ajv.compile(submissionSchema);

  const valid = validate(answers);

  if (!valid) {
    const details = formatAjvErrors(validate.errors);
    throw new ValidationError("Submission validation failed", details);
  }

  return true;
};