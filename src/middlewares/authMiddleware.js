import authRepositories from "../repositories/userRepositories.js";
import { verifyToken } from "../utils/jwtToken.js";
import { ForbiddenError, UnAuthorisedError } from "../utils/errors.js";

export const authMiddleware = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      let token;

      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
      ) {
        token = req.headers.authorization.split(" ")[1];
      }

      if (!token) {
        return next(new UnAuthorisedError("unauthorised Access"));
      }

      const decoded = verifyToken(token);

      if (!decoded?.userId) {
        return next(new UnAuthorisedError("Invalid token payload"));
      }

      const user = await authRepositories.findUserById(decoded.userId);

      if (!user) {
        return next(new UnAuthorisedError("User no longer exists"));
      }

      if (allowedRoles.length > 0) {
        if (!allowedRoles.includes(user.role)) {
          throw new ForbiddenError("Access Denied");
        }
      }

      req.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      };

      next();
    } catch (error) {
      const err = error instanceof UnAuthorisedError
        ? error
        : error instanceof ForbiddenError
          ? new ForbiddenError("Access Denied")
          : new UnAuthorisedError("Invalid or expired token");
      next(err)
    }
  };
};
