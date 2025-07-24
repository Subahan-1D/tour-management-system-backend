import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
  port: string;
  mongodb_uri: string;
  node_env: "development" | "production";
  BCRYPT_SALT_ROUND: string;
  JWT_ACCESS_EXPIRED: string;
  JWT_ACCESS_SECRET: string;
  SUPER_ADMIN_EMAIL: string;
  SUPER_ADMIN_PASSWORD: string;
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariables: string[] = [
    "port",
    "mongodb_uri",
    "node_env",
    "BCRYPT_SALT_ROUND",
    "JWT_ACCESS_EXPIRED",
    "JWT_ACCESS_SECRET",
    "SUPER_ADMIN_EMAIL",
   "SUPER_ADMIN_PASSWORD"
  ];

  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable ${key}`);
    }
  });
  return {
    port: process.env.PORT as string,
    mongodb_uri: process.env.MONGODB_URI as string,
    node_env: process.env.NODE_ENV as "development" | "production",
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
    JWT_ACCESS_EXPIRED: process.env.JWT_ACCESS_EXPIRED as string,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    SUPER_ADMIN_EMAIL:process.env.SUPER_ADMIN_EMAIL as string,
    SUPER_ADMIN_PASSWORD:process.env.SUPER_ADMIN_PASSWORD as string
  };
};
export const envVars = loadEnvVariables();
