const express = require('express');
const router = express.Router();
const LearningDevelopmentController = require('../controllers/learningDevelopmentController');

router.post('/:userId/add', LearningDevelopmentController.addLearningDevelopment);
router.get("/:userId/all", LearningDevelopmentController.getAllLearningDevelopment);
router.get("/:userId/:ldId", LearningDevelopmentController.getLearningDevelopmentById);
router.put("/:userId/:ldId", LearningDevelopmentController.updateLearningDevelopmentById);
router.delete("/:userId/:ldId", LearningDevelopmentController.deleteLearningDevelopmentById);

module.exports = router;