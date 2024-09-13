const express = require('express');
const router = express.Router();
const AssumptionOfDutyController = require('../controllers/assumptionOfDutyController');

router.post('/add', AssumptionOfDutyController.addAssumptionOfDuty);
router.get("/all", AssumptionOfDutyController.getAllAssumptionOfDuty);
router.get("/:id", AssumptionOfDutyController.getAssumptionOfDutyById);
router.put("/:id", AssumptionOfDutyController.updateAssumptionOfDutyById);
router.delete("/:id", AssumptionOfDutyController.deleteAssumptionOfDutyById);

module.exports = router;