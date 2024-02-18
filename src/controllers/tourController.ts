import { Request, Response } from "express";
import { Tour } from "../models/tourModel";

exports.getAllTours = async (req: Request, res: Response): Promise<void> => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(elem => delete queryObj[elem]);
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    const query = await Tour.find(JSON.parse(queryString));

    const tours = await query;
    res.cookie('test', 'test',{
      httpOnly: true
    })
    res.status(200)
      .json({
        tours
      });
  } catch(err) {
    res.status(400).json({
      message: err
    })
  }
}

exports.createTour = async (req: Request, res: Response): Promise<void> => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201)
      .json({
        message: "Created",
        data: {
          newTour
        }
      });
  } catch(err) {
    res.status(400).json({
      message: err
    });
  }
}

exports.getTourById = async (req: Request, res: Response): Promise<void> => {
  try {
    const tour = Tour.findById(req.params.id);
    res.status(200)
      .json({
        data: {
          tour
        }
    });
  } catch(err) {
    res.status(404)
      .json({
        message: "Tour could not be found"
    });
  }
}

exports.updateTour = async (req: Request, res: Response): Promise<void> => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200)
      .json({
        data: {
          tour
        }
      });
  } catch(err) {
    res.status(404)
      .json({
        message: "Tour could not be found"
      });
  }
}

exports.deleteTour = async (req: Request, res: Response): Promise<void> => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204)
      .json({
        data: null
      });
  } catch(err) {
    res.status(404)
      .json({
        message: "Tour could not be found"
      });
  }
}