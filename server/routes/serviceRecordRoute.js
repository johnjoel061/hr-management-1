const express = require('express');
const router = express.Router();
const ServiceRecordController = require('../controllers/serviceRecordController');

router.post('/:userId/add', ServiceRecordController.addServiceRecord);
router.get("/:userId/all", ServiceRecordController.getAllServiceRecord);
router.get("/:userId/:srId", ServiceRecordController.getServiceRecordById);
router.put("/:userId/:srId", ServiceRecordController.updateServiceRecordById);
router.delete("/:userId/:srId", ServiceRecordController.deleteServiceRecordById);

module.exports = router;