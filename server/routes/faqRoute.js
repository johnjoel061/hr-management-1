const express = require('express');
const router = express.Router();
const FaqController = require('../controllers/faqController');

router.post('/add', FaqController.addFaq);
router.get("/all", FaqController.getAllFaq);
router.get("/:id", FaqController.getFaqById);
router.put("/:id", FaqController.updateFaqById);
router.delete("/:id", FaqController.deleteFaqById);

module.exports = router;