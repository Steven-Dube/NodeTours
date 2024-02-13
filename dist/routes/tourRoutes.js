"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const router = express_1.default.Router();
router.route('/')
    .get(authController.authorize, tourController.getAllTours)
    .post(tourController.createTour)
    .put(tourController.updateTour);
router.route('/:id')
    .get(tourController.getTourById);
module.exports = router;
//# sourceMappingURL=tourRoutes.js.map