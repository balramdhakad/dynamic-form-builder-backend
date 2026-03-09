import dotenv from "dotenv";
dotenv.config();

const toNumber = (key, value) => {
  const parsed = Number(value);
  if (isNaN(parsed)) {
    throw new Error(`${key} must be a number`);
  }
  return parsed;
};

const required = (key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return process.env[key];
};

const serverConfig = {
  PORT: process.env.PORT ? toNumber("PORT", process.env.PORT) : 5000,
  DATABASE_URL: required("DATABASE_URL"),
  environment:
    (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "prod")
      ? "production"
      : process.env.NODE_ENV === "test"
        ? "test"
        : "development",
};


const jwtConfig = {
  JWT_SECRET: required("JWT_SECRET"),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
};

const redisConfig = {
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT
    ? toNumber("REDIS_PORT",process.env.REDIS_PORT)
    : 6379,
};

const env = {
  serverConfig,
  jwtConfig,
  redisConfig,
};

export default env;