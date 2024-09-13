const express = require('express');
const router = express.Router();
const ClearanceMoneyPropertyAcctController = require('../controllers/clearanceMoneyPropertyAcctController');

router.post('/add', ClearanceMoneyPropertyAcctController.addClearanceMoneyPropertyAcct);
router.get("/all", ClearanceMoneyPropertyAcctController.getAllClearanceMoneyPropertyAcct);
router.get("/:id", ClearanceMoneyPropertyAcctController.getClearanceMoneyPropertyAcctById);
router.put("/:id", ClearanceMoneyPropertyAcctController.updateClearanceMoneyPropertyAcctById);
router.delete("/:id", ClearanceMoneyPropertyAcctController.deleteClearanceMoneyPropertyAcctById);

module.exports = router;