import authRepositories from "../repositories/userRepositories.js";
import {
  ConflictError,
  InternalServerError,
  UnAuthorisedError,
  ValidationError,
} from "../utils/errors.js";
import { generateToken } from "../utils/jwtToken.js";
import { comparePassword, hashPassword } from "../utils/password.js";

const signupUser = async (username, password, email) => {
  //validate again
  if (!username || !password || !email) {
    throw new ValidationError(`All fields are Required`);
  }

  //check Email already Registered
  const isEmailExist = await authRepositories.isExistsByField("email", email);
  if (isEmailExist) {
    throw new ConflictError("Email Already Registered");
  }

  //check Email already Registered
  const usernameExist = await authRepositories.isExistsByField(
    "username", //field
    username, //value
  );
  if (usernameExist) {
    throw new ConflictError("Username Already Registered");
  }

  //hashed password
  const hashedPassword = await hashPassword(password);

  //Create user
  const user = await authRepositories.createUser(
    username,
    email,
    hashedPassword,
  );

  //Check user is created or not
  if (!user) {
    throw new InternalServerError("unable to Create User at the moment");
  }

  return user;
};
const loginUser = async (password, email) => {
  //validate again
  if (!password || !email) {
    throw new ValidationError(`All fields are Required`);
  }

  //check Email already Registered
  const user = await authRepositories.findUserByEmail(email);
  if (!user) {
    throw new UnAuthorisedError("Invalid Credentials");
  }

  //match password
  const isMatch = await comparePassword(password, user.hashed_password);

  //throw error if password not matched
  if (!isMatch) {
    throw new UnAuthorisedError("Invalid Credentials");
  }

  //generate Token
  const token = generateToken(user.id);

  const responseUser = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  return { responseUser, token };
};

const authService = {
  signupUser,
  loginUser,
};

export default authService;
