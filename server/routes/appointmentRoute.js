const express = require('express');
const router = express.Router();
const AppointmentController = require('../controllers/appointmentController');

router.post('/add', AppointmentController.addAppointment);
router.get("/all", AppointmentController.getAllAppointment);
router.get("/:id", AppointmentController.getAppointmentById);
router.put("/:id", AppointmentController.updateAppointmentById);
router.delete("/:id", AppointmentController.deleteAppointmentById);

module.exports = router;