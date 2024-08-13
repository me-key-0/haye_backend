const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user: {
     type: mongoose.Schema.Types.ObjectId, 
     ref: 'User',
      required: true 
    },
  restaurant: {
     type: mongoose.Schema.Types.ObjectId, 
     ref: 'Restaurant', 
     required: true 
    },
  rating: {
     type: Number,
      required: true,
       min: 1, max: 5
     },
  comment: {
     type: String,
      required: true 
    },
  date: { 
    type: Date, 
    default: Date.now 
},
  title: { 
    type: String, 
    default: '' 
},
  anonymous: { 
    type: Boolean, 
    default: false
 },
  verified_purchase: { 
    type: Boolean,
     default: false 
    },
  helpful_count: {
     type: Number,
      default: 0 
    }
});

module.exports = mongoose.model('Review', ReviewSchema);
