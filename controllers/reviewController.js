
const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant');

// Create a new review
const createReview = async (req, res) => {
    try {
        const { restaurant, rating, comment} = req.body;

        // Ensure the restaurant exists
        const restaurantExists = await Restaurant.findById(restaurant);
        if (!restaurantExists) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        const review = new Review({
            user: req.user.id,  // assuming you have user authentication
            restaurant,
            rating,
            comment,
        });

        await review.save();
        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ message: "server not found" });
    }
};

// Get all reviews for a specific restaurant
const getReviewsByRestaurant = async (req, res) => {
    try {
        const reviews = await Review.find({ restaurant: req.params.restaurantId }).populate('user', 'username');
        if (reviews) {
            res.json(reviews);
        } else {
            res.status(404).json({ message: 'Review not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a specific review by ID
const getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id).populate('user', 'username');
        if (review) {
            res.json(review);
        } else {
            res.status(404).json({ message: 'Review not found' });
        }
    } catch (err) {
        res.status(500).json({ message: "sever not found" });
    }
};

// Update a review
const updateReview = async (req, res) => {
    try {
        
        const review = await Review.findByIdAndUpdate( req.params.id , req.body, { new: true });

        if (review) {
            res.json(review);
        } else {
            res.status(404).json({ message: 'Review not found' });
        }
    } catch (error) {
        res.status(500).json({ message: "server not found" });
    }
};

// Delete a review
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (review) {
            res.json({ message: 'Review deleted' });
        } else {
            res.status(404).json({ message: 'Review not found' });
        }
    } catch (err) {
        res.status(500).json({ message: "server not found" });
    }
};


module.exports = {
    createReview,
    getReviewsByRestaurant,
    getReviewById,
    updateReview,
    deleteReview,
  };
  