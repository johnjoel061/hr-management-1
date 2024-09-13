const express = require('express');
const router = express.Router();
const CopiesOfDiscipActionController = require('../controllers/copiesOfDiscipActionController');

router.post('/add', CopiesOfDiscipActionController.addCopiesOfDiscipAction);
router.get("/all", CopiesOfDiscipActionController.getAllCopiesOfDiscipAction);
router.get("/:id", CopiesOfDiscipActionController.getCopiesOfDiscipActionById);
router.put("/:id", CopiesOfDiscipActionController.updateCopiesOfDiscipActionById);
router.delete("/:id", CopiesOfDiscipActionController.deleteCopiesOfDiscipActionById);

module.exports = router;