"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const mongoose_1 = __importDefault(require("mongoose"));
const todo_1 = __importDefault(require("./routes/todo"));
const authentication_1 = __importDefault(require("./routes/authentication"));
const app = express_1.default();
app.use(body_parser_1.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});
app.use("/api/v1/todos", todo_1.default);
app.use("/api/v1/auth", authentication_1.default);
app.use((err, req, res, next) => {
  res.status(err.code || 500).json({
    message: err.message || "Server is busy at the moment !",
    statusCode: err.code || 500,
    requestStatus: "Fail",
  });
});
mongoose_1.default
  .connect(
    `mongodb://localhost:27017/TodoApp?readPreference=primary&appname=MongoDB%20Compass&ssl=false`,
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
