import { connect } from "mongoose";
import { MONGODB_URI } from "../core/config.js";
import { logger } from "../utils/logger.js";
import { throwError } from "../utils/handleErrors.js";

export default class Database {
  static async db() {
    try {
      const connection = await connect(MONGODB_URI);

      if (!connection) {
        throwError("Unable to connect to database", 500);
      }
      logger.info("Database connection successful!");
    } catch (err) {
      logger.error("Database connection failed!");
    }
  }
};
