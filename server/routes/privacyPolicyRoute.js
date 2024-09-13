const express = require('express');
const router = express.Router();
const PrivacyPolicyController = require('../controllers/privacyPolicyController');

router.post('/add', PrivacyPolicyController.addPrivacyPolicy);
router.get("/all", PrivacyPolicyController.getAllPrivacyPolicy);
router.get("/:id", PrivacyPolicyController.getPrivacyPolicyById);
router.put("/:id", PrivacyPolicyController.updatePrivacyPolicyById);
router.delete("/:id", PrivacyPolicyController.deletePrivacyPolicyById);

module.exports = router;