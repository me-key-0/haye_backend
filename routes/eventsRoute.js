
const express = require('express');
const router = express.Router();
const {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,} = require('../controllers/eventController');

// router.get('/events', eventController.getAllEvents);
// router.get('/events/:id', eventController.getEventById);
// router.post('/events', eventController.createEvent);
// router.put('/events/:id', eventController.updateEvent);
// router.delete('/events/:id', eventController.deleteEvent);

router.route("/").get(getAllEvents);

router.route("/:id").get(getEventById);

router.route("/").post(createEvent);

router.route("/:id").put(updateEvent);

router.route("/:id").delete(deleteEvent);


module.exports = router;
