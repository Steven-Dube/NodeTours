"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tour = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const tourSchema = new mongoose_1.default.Schema({
    name: { type: String, required: [true, 'A tour must have a name'] },
    price: { type: Number, required: [true, 'A tour must have a price'] },
    rating: { type: Number, required: false },
    description: { type: String, required: [true, 'A tour must have a description'], trim: true },
    maxGroupSize: { type: Number, required: [true, 'A tour must have a max group size'] },
    difficulty: { type: Number, required: [true, 'A tour must have a difficulty'], trim: true },
    summary: { type: String, required: false }
});
const Tour = mongoose_1.default.model('Tour', tourSchema);
exports.Tour = Tour;
//# sourceMappingURL=tourModel.js.map