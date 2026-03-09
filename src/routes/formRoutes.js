import { Router } from "express";
import {
  createFormSchemaController,
  deleteFormController,
  getAllFormsController,
  getFormByIdController,
  updateFormSchemaController,
} from "../controllers/formControllers.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createFormValidator,
  deleteFormValidator,
  getAllFormsValidator,
  getFormByIdValidator,
  updateFormValidator,
} from "../validator/formValidator.js";
import submissionRoutes from "./submissionRoutes.js";

const router = Router();

router.post(
  "/",
  authMiddleware(["ADMIN"]),
  createFormValidator,
  createFormSchemaController,
);
router.get(
  "/",
  authMiddleware(["ADMIN", "USER"]),
  getAllFormsValidator,
  getAllFormsController,
);

router.get(
  "/:formId",
  authMiddleware(["ADMIN", "USER"]),
  getFormByIdValidator,
  getFormByIdController,
);

router.put(
  "/:formId",
  authMiddleware(["ADMIN"]),
  updateFormValidator,
  updateFormSchemaController,
);

router.delete(
  "/:formId",
  authMiddleware(["ADMIN"]),
  deleteFormValidator,
  deleteFormController,
);

// nested submission routes
router.use("/:formId/submissions", submissionRoutes);

export default router;
