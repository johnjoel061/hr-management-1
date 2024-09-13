const express = require('express');
const router = express.Router();
const CertOfLeaveBalanceController = require('../controllers/certOfLeaveBalanceController');

router.post('/add', CertOfLeaveBalanceController.addCertOfLeaveBalance);
router.get("/all", CertOfLeaveBalanceController.getAllCertOfLeaveBalance);
router.get("/:id", CertOfLeaveBalanceController.getCertOfLeaveBalanceById);
router.put("/:id", CertOfLeaveBalanceController.updateCertOfLeaveBalanceById);
router.delete("/:id", CertOfLeaveBalanceController.deleteCertOfLeaveBalanceById);

module.exports = router;
