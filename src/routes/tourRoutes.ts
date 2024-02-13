import express, { Router } from "express";
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const router: Router = express.Router();


router.route('/')
  .get(authController.authorize, tourController.getAllTours)
  .post(tourController.createTour)
  .put(tourController.updateTour);

router.route('/:id')
  .get(tourController.getTourById);

module.exports = router;