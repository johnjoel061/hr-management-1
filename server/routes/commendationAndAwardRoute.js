const express = require('express');
const router = express.Router();
const CommendationAndAwardController = require('../controllers/commendationAndAwardController');

router.post('/add', CommendationAndAwardController.addCommendationAndAward);
router.get("/all", CommendationAndAwardController.getAllCommendationAndAward);
router.get("/:id", CommendationAndAwardController.getCommendationAndAwardById);
router.put("/:id", CommendationAndAwardController.updateCommendationAndAwardById);
router.delete("/:id", CommendationAndAwardController.deleteCommendationAndAwardById);

module.exports = router;