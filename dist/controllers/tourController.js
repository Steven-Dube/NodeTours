"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tourModel_1 = require("../models/tourModel");
exports.getAllTours = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryObj = Object.assign({}, req.query);
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(elem => delete queryObj[elem]);
        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        const query = yield tourModel_1.Tour.find(JSON.parse(queryString));
        const tours = yield query;
        // res.status(200)
        //   .json({
        //     tours
        //   });
        res.writeHead(200, {
            "Set-Cookie": `${queryString}`
        }).json({
            tours
        }).end();
    }
    catch (err) {
        res.status(400).json({
            message: err
        });
    }
});
exports.createTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newTour = yield tourModel_1.Tour.create(req.body);
        res.status(201)
            .json({
            message: "Created",
            data: {
                newTour
            }
        });
    }
    catch (err) {
        res.status(400).json({
            message: err
        });
    }
});
exports.getTourById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tour = tourModel_1.Tour.findById(req.params.id);
        res.status(200)
            .json({
            data: {
                tour
            }
        });
    }
    catch (err) {
        res.status(404)
            .json({
            message: "Tour could not be found"
        });
    }
});
exports.updateTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tour = yield tourModel_1.Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200)
            .json({
            data: {
                tour
            }
        });
    }
    catch (err) {
        res.status(404)
            .json({
            message: "Tour could not be found"
        });
    }
});
exports.deleteTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield tourModel_1.Tour.findByIdAndDelete(req.params.id);
        res.status(204)
            .json({
            data: null
        });
    }
    catch (err) {
        res.status(404)
            .json({
            message: "Tour could not be found"
        });
    }
});
//# sourceMappingURL=tourController.js.map