import * as ratingService from '../services/rating.service.js';

export const submitRating = async (req, res, next) => {
  try {
    const rating = await ratingService.submitRating(req.user.id, req.params.storeId, req.body.rating);
    res.status(201).json({ success: true, data: rating });
  } catch (error) {
    next(error);
  }
};

export const updateRating = async (req, res, next) => {
  try {
    const rating = await ratingService.updateRating(req.user.id, req.params.storeId, req.body.rating);
    res.json({ success: true, data: rating });
  } catch (error) {
    next(error);
  }
};

export const getUserRatings = async (req, res, next) => {
  try {
    const ratings = await ratingService.getUserRatings(req.user.id);
    res.json({ success: true, data: ratings });
  } catch (error) {
    next(error);
  }
};
