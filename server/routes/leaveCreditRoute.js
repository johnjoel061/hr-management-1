const express = require('express');
const router = express.Router();
const LeaveCreditController = require('../controllers/leaveCreditController');

router.post('/:userId/add', LeaveCreditController.addLeaveCredit);
router.get("/:userId/all", LeaveCreditController.getAllLeaveCredit);
router.get("/:userId/:lcId", LeaveCreditController.getLeaveCreditById);
router.put("/:userId/:lcId", LeaveCreditController.updateLeaveCreditById);
router.delete("/:userId/:lcId", LeaveCreditController.deleteLeaveCreditById);

module.exports = router;