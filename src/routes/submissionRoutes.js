import { Router } from "express";
import {
  getResponse,
  getResponseInCSV,
  responseSubmit,
} from "../controllers/submissionControllers.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { submitRateLimiter } from "../middlewares/rateLimit.js";
import {
  exportCSVValidator,
  getResponseValidator,
  submitFormValidator,
} from "../validator/submissionExpressValidator.js";

const router = Router({ mergeParams: true });

//submission of response on any form
router.post(
  "/",
  authMiddleware(["USER"]),
  submitRateLimiter,
  submitFormValidator,
  responseSubmit,
);

//get all Responses of any form or it's previous versions
router.get("/", authMiddleware(["ADMIN"]), getResponseValidator, getResponse);

//export all Responses of any form or it's previous versions
router.get(
  "/export",
  authMiddleware(["ADMIN"]),
  exportCSVValidator,
  getResponseInCSV,
);

export default router;
