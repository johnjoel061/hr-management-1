const express = require('express');
const router = express.Router();
const AwardController = require('../controllers/awardController');

router.post('/:userId/add', AwardController.addAward);
router.get("/:userId/all", AwardController.getAllAward);
router.get("/:userId/:awId", AwardController.getAwardById);
router.put("/:userId/:awId", AwardController.updateAwardById);
router.delete("/:userId/:awId", AwardController.deleteAwardById);

module.exports = router;