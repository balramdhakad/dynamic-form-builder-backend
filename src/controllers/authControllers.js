import authService from "../services/authServices.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const loginUserController = asyncHandler(async (req, res) => {
  const { password, email } = req.body;

  const { responseUser, token } = await authService.loginUser(password, email);

  res.status(200).json({
    message: "login Success",
    user: responseUser,
    token 
  });
});

export const signupUserController = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body;

  const data = await authService.signupUser(username, password, email);

  res.status(201).json({
    message: "signup Success",
    user: data,
  });
});
