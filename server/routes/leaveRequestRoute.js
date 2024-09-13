const express = require('express');
const router = express.Router();
const leaveRequestController = require('../controllers/leaveRequestController');

router.post('/leave-requests/add', leaveRequestController.addLeaveRequest);
router.put('/leave-requests/status/:id', leaveRequestController.approveLeaveRequest);
router.delete('/leave-requests/:leaveRequestId', leaveRequestController.deleteLeaveRequest);
router.get('/leave-requests/all', leaveRequestController.getAllLeaveRequests);
router.get('/leave-requests/:leaveRequestId', leaveRequestController.getLeaveRequestById);

router.get('/leave-requests/:id/pdf', leaveRequestController.generateLeaveRequestPDF);

// router.get('/leave-requests/pending', leaveRequestController.getPendingLeaveRequests);
// router.get('/leave-requests/approved', leaveRequestController.getApprovedLeaveRequests);
// router.get('/leave-requests/rejected', leaveRequestController.getRejectedLeaveRequests);

module.exports = router;
