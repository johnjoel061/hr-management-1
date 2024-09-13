const express = require('express');
const router = express.Router();
const BirthCertificateController = require('../controllers/birthCertificateController');

router.post('/add', BirthCertificateController.addBirthCertificate);
router.get("/all", BirthCertificateController.getAllBirthCertificate);
router.get("/:id", BirthCertificateController.getBirthCertificateById);
router.put("/:id", BirthCertificateController.updateBirthCertificateById);
router.delete("/:id", BirthCertificateController.deleteBirthCertificateById);

module.exports = router;