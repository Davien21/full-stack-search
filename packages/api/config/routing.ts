import "express-async-errors";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import errorMiddleware from "@/middlewares/error";

import hotelsRouter from "@/routes/hotels";
import citiesRouter from "@/routes/cities";
import countriesRouter from "@/routes/countries";
import searchRouter from "@/routes/search";

import { NotFoundError } from "@/config/errors";
import logger from "./logger";

const app = express();

app.use(cors());
app.use(express.json());

// log server requests
app.use(
  morgan("dev", { stream: { write: (message) => logger.info(message.trim()) } })
);

app.use(hotelsRouter);
app.use(citiesRouter);
app.use(countriesRouter);
app.use(searchRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError());
});

app.use(errorMiddleware);

export const appRouter = app;
