const express = require('express');
const router = express.Router();
const leaveTypeController = require('../controllers/leaveTypeController');

router.post('/add', leaveTypeController.addLeaveType);
router.get("/all", leaveTypeController.getAllLeaveType);
router.get("/:id", leaveTypeController.getLeaveTypeById);
router.put("/:id", leaveTypeController.updateLeaveTypeById);
router.delete("/:id", leaveTypeController.deleteLeaveTypeById);

module.exports = router;