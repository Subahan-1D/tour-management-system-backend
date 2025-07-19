/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import { envVars } from "./app/config/env";
import app from "./app";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.mongodb_uri);
    console.log("Connected to DB!");
    server = app.listen(envVars.port, () => {
      console.log(`Server is listening port ${envVars.port}`);
    });
  } catch (error) {
    console.log(error);
  }
};
startServer();

process.on("unhandledRejection", (err) => {
  console.log("unhandled Rejection detected... Server shuting down..", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.log("uncaught exception detected... Server shuting down..", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM Signal Received... Server shuting down..");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("SIGINT", () => {
  console.log("SIGINT Signal Received... Server shuting down..");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
// unhandled rejection error
// Promise.reject(new Error("I forgot catch this promise"));

// uncaught rejection error
// throw new Error("I forgot to handle this local error");

// signal termination sigterm

/**
 * unhandled rejection error
 * uncaught rejection error
 * signal termination sigterm
 * */
