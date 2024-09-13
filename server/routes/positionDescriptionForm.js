const express = require('express');
const router = express.Router();
const PositionDescriptionFormController = require('../controllers/positionDescriptionFormController');

router.post('/add', PositionDescriptionFormController.addAPositionDescriptionForm);
router.get("/all", PositionDescriptionFormController.getAllPositionDescriptionForm);
router.get("/:id", PositionDescriptionFormController.getPositionDescriptionFormById);
router.put("/:id", PositionDescriptionFormController.updatePositionDescriptionFormById);
router.delete("/:id", PositionDescriptionFormController.deletePositionDescriptionFormById);

module.exports = router;