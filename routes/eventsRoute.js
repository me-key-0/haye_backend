const uploadEventMiddleware = require('../middleware/uploadEventMiddleware');
const express = require("express");
const Event = require('../models/eventsModel')
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  scheduleHanlde,
  deleteEvents
} = require("../controllers/eventController");

router.route("/").get(getAllEvents);

router.route("/:id").get(getEventById);

router.route("/").post(uploadEventMiddleware.single("image"),createEvent);

router.route("/:id").put(updateEvent);

router.route("/:id").delete(deleteEvent);

router.route("/").delete(deleteEvents)

router.route("/schedule").post(scheduleHanlde);

module.exports = router;
