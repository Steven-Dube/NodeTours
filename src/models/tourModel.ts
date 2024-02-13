import mongoose, { Model } from "mongoose";

const tourSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'A tour must have a name'] },
  price: { type: Number, required: [true, 'A tour must have a price'] },
  rating: { type: Number, required: false },
  description: { type: String, required: [true, 'A tour must have a description'], trim: true },
  maxGroupSize: { type: Number, required: [true, 'A tour must have a max group size'] },
  difficulty: { type: Number, required: [true, 'A tour must have a difficulty'], trim: true },
  summary: { type: String, required: false }
});

const Tour: any = mongoose.model('Tour', tourSchema);

export { Tour }