const express = require("express");
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

router.route("/").get(getAllEvents);

router.route("/:id").get(getEventById);

router.route("/").post(createEvent);

router.route("/:id").put(updateEvent);

router.route("/:id").delete(deleteEvent);

module.exports = router;
