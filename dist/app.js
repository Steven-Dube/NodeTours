"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const cookieParser = require("cookie-parser");
const cors = require('cors');
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(cookieParser());
const corsOptions = {
    origin: "https://nodetoursapi.onrender.com"
};
app.use(cors(corsOptions));
app.use('/tours', tourRouter);
app.use('/users', userRouter);
module.exports = app;
//# sourceMappingURL=app.js.map