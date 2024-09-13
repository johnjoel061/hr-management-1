const express = require('express');
const router = express.Router();
const eligibilityController = require('../controllers/eligibilityController');

router.post('/add', eligibilityController.addEligibility);
router.get("/all", eligibilityController.getAllEligibility);
router.get("/:id", eligibilityController.getEligibilityById);
router.put("/:id", eligibilityController.updateEligibilityById);
router.delete("/:id", eligibilityController.deleteEligibilityById);

module.exports = router;