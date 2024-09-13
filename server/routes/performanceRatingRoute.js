const express = require('express');
const router = express.Router();
const PerformanceRatingController = require('../controllers/performanceRatingController');

router.post('/:userId/add', PerformanceRatingController.addPerformanceRating);
router.get("/:userId/all", PerformanceRatingController.getAllPerformanceRating);
router.get("/:userId/:prId", PerformanceRatingController.getPerformanceRatingById);
router.put("/:userId/:prId", PerformanceRatingController.updatePerformanceRatingById);
router.delete("/:userId/:prId", PerformanceRatingController.deletePerformanceRatingById);

module.exports = router;