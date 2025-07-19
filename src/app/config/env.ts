import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
  port: string;
  mongodb_uri: string;
  node_env: "development" | "production";
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariables: string[] = ["port", "mongodb_uri", "node_env"];

  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable ${key}`);
    }
  });
  return {
    port: process.env.PORT as string,
    mongodb_uri: process.env.MONGODB_URI as string,
    node_env: process.env.NODE_ENV as "development" | "production",
  };
};
export const envVars = loadEnvVariables();
