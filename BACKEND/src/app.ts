import express, { Request, Response, NextFunction } from "express";
import { json } from "body-parser";
import mongoose from "mongoose";

import TodoRouter from "./routes/todo";
import AuthencationRouter from "./routes/authentication";
import HttpError from "./models/HttpError";

const app = express();

app.use(json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/v1/todos", TodoRouter);
app.use("/api/v1/auth", AuthencationRouter);

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.code || 500).json({
    message: err.message || "Server is busy at the moment !",
    statusCode: err.code || 500,
    requestStatus: "Fail",
  });
});

mongoose
  .connect(
    `mongodb+srv://chakri123:chakri231@cluster0.flykt.mongodb.net/todoapp?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }
  )
  .then(() => {
    app.listen(process.env.PORT || 5000);
  })
  .catch((error) => {
    console.log(error);
  });
