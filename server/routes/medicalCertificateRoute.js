const express = require('express');
const router = express.Router();
const MedicalCertificateController = require('../controllers/medicalCertificateController');

router.post('/add', MedicalCertificateController.addMedicalCertificate);
router.get("/all", MedicalCertificateController.getAllMedicalCertificate);
router.get("/:id", MedicalCertificateController.getAppointmentById);
router.put("/:id", MedicalCertificateController.updateMedicalCertificateById);
router.delete("/:id", MedicalCertificateController.deleteMedicalCertificateById);

module.exports = router;