const express = require('express');
const router = express.Router();
const { 
    createReview,
    getReviewsByRestaurant,
    getReviewById,
    updateReview,
    deleteReview,} = require('../controllers/reviewController');

// Route to get all reviews for a specific restaurant
router.route('/restaurants/:restaurantId/reviews').get(getReviewsByRestaurant);

// Route to create a new review for a specific restaurant
router.route('/restaurants/:restaurantId/reviews').post(createReview);

// Route to get a specific review by its ID
router.route('/reviews/:reviewId').get(getReviewById);

// Route to update a specific review by its ID
router.route('/reviews/:reviewId').put(updateReview);

// Route to delete a specific review by its ID
router.route('/reviews/:reviewId').delete(deleteReview);

module.exports = router;
