import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes";
import { errorHandler } from "./common/middleware/error.middleware";
import rateLimit from "express-rate-limit";
import xss from "xss-clean";

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

//SANITIZATION
app.use(xss());
app.use(cors());
app.use(
  helmet({
    crossOriginResourcePolicy: false, // needed for streaming
  }),
);
app.use(express.json());

app.use("/api", routes);

// global error handler
app.use(errorHandler);

export default app;
