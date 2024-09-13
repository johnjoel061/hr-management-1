const express = require('express');
const router = express.Router();
const CertificateOfEligibilityController = require('../controllers/certificateOfEligibilityController');

router.post('/add', CertificateOfEligibilityController.addCertificateOfEligibility);
router.get("/all", CertificateOfEligibilityController.getAllCertificateOfEligibility);
router.get("/:id", CertificateOfEligibilityController.getCertificateOfEligibilityById);
router.put("/:id", CertificateOfEligibilityController.updateCertificateOfEligibilityById);
router.delete("/:id", CertificateOfEligibilityController.deleteCertificateOfEligibilityById);

module.exports = router;