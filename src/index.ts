import express, { urlencoded } from "express";
import { ErrorRequestHandler, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import { logger } from "./utils/logger.js";
import { PORT } from "./core/config.js";
import dotenv from "dotenv";
dotenv.config();

// app init
const app = express();

// middleware
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
app.use(morgan("tiny"));

// router
import userRouter from "./router/userRouter.js";

app.use("/api", userRouter)

app.get("/", (req: Request, res: Response) =>
  res
    .status(200)
    .send(
      '<code>Market Backend Running...<a target="_blank" href="" style="text-decoration: none; cursor: pointer; color: black; font-weight: bold">&lt;Go To Docs/&gt;</a></code>'
    )
);

import dev from "./config/developement.js";
import prod from "./config/production.js";
import test from "./config/test.js";



if (process.env.NODE_ENV === "dev") {
  dev.db().then(() =>
    app.listen(PORT, () => {
      logger.info(`backend running on port ${PORT}`);
    })
  );
}

if (process.env.NODE_ENV === "prod") {
  prod.db().then(() =>
    app.listen(PORT, () => {
      logger.info(`backend running on port ${PORT}`);
    })
  );
}

if (process.env.NODE_ENV === "test") {
  test.db().then(() =>
    app.listen(PORT, () => {
      logger.info(`backend running on port ${PORT}`);
    })
  );
}
