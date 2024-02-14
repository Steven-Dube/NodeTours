import express, { Express } from "express";
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const cookieParser = require("cookie-parser");
const cors = require('cors');
const app: Express = express();
app.use(express.json());

app.use(cookieParser());

const corsOptions = {
  origin: "https://nodetoursapi.onrender.com"
};

app.use(cors(corsOptions));
app.use('/tours', tourRouter);
app.use('/users', userRouter);

module.exports = app;
