const Event = require("../models/eventsModel");
const cloudinary = require('cloudinary');

// List all events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get a single event by ID
const getEventById = async (req, res) => {
  const eventId = req.params.id;

  try {
    const event = await Event.findById(eventId);
    if (event) {
      res.status(200).json(event);
    } else {
      res.status(404).json({ error: "Event not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Create a new event
const createEvent = async (req, res) => {
  try {
    const { Name } = req.body;
    const photo = req.file;    
    console.log(photo.path);

    // Store the uploaded image on cloudinary
    const result = await cloudinary.uploader.upload(photo.path);
    console.log(result)

    const image_url = result.secure_url;
    console.log(image_url);

    // Store the uploaded info on db
    const event = await Event.create({
      Name,
      photo:image_url
    });

    res.status(200).json({
      message:"Event successfully registered!"
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// Update an event by ID
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (event) {
      res.status(200).json(event);
    } else {
      res.status(404).json({ error: "Event not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Delete an event by ID
const deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (deletedEvent) {
      res.status(200).json({ message: "Event deleted" });
    } else {
      res.status(404).json({ error: "Event not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const scheduleHanlde = async (req, res) => {
  const {event, date} = req.body;
  try {
    const Schedule = await Schedule.create(
      {
        event,
        date
      }
    )
    res.status(200).json({
      message:"Event Scheduled Sucessfully"
    })
  } catch (error) {
    res.status(500).json({
      message:"Internal server error"
    })
  }
}

const deleteEvents = async (req,res) => {
  try {
    await Event.deleteMany()
    res.status(200).json({
      message:"All Deleted!"
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({mesage:"Internal server error"})
  }
}

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  scheduleHanlde,
  deleteEvents
};
