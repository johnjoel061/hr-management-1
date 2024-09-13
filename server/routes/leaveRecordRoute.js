const express = require('express');
const router = express.Router();
const LeaveRecordController = require('../controllers/leaveRecordController');

router.post('/:userId/add', LeaveRecordController.addLeaveRecord);
router.get("/:userId/all", LeaveRecordController.getAllLeaveRecord);
router.get("/:userId/:lrId", LeaveRecordController.getLeaveRecordById);
router.put("/:userId/:lrId", LeaveRecordController.updateLeaveRecordById);
router.delete("/:userId/:lrId", LeaveRecordController.deleteLeaveRecordById);

module.exports = router;