const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Event Schema
const eventSchema = new Schema({
  Name: {
    type: String,
    // required: true,
    // trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'], // GeoJSON format
      // required: true
    },
    coordinates: {
      type: [Number], // Array of [longitude, latitude]
      // required: true
    }
  },
  photo: {
    type: String, // URL to the photo
    required: true
  },
  duration: {
    type: Number, // Duration in days
    required: false
  },
  startTime: {
    type: Date,
    // required: true
  },
  endTime: {
    type: Date,
    // required: true
  },
  eventTitle: {
    type: String,
    // required: true
  },
  eventType: {
    type: String,
    enum: ['Coming Soon', 'Festival', 'Special Offer', 'Other'],
    // required: true
  },
  description: {
    type: String,
    required: false
  }
}
,{
    timestamps: true
});



// Create the Event model
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
