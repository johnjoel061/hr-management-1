const express = require('express');
const router = express.Router();
const CalendarController = require('../controllers/calendarController');

router.post('/add', CalendarController.addEvent);
router.get('/all', CalendarController.getAllEvents);
router.get('/:id', CalendarController.getEventById);
router.delete('/:id', CalendarController.deleteEventById);

module.exports = router;
