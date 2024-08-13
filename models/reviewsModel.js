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
      required: false 
    }
}
,{
    timestamps: true
});

module.exports = mongoose.model('Review', ReviewSchema);
