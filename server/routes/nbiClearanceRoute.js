const express = require('express');
const router = express.Router();
const NbiClearanceController = require('../controllers/nbiClearanceController');

router.post('/add', NbiClearanceController.addNbiClearance);
router.get("/all", NbiClearanceController.getAllNbiClearance);
router.get("/:id", NbiClearanceController.getNbiClearanceById);
router.put("/:id", NbiClearanceController.updateNbiClearanceById);
router.delete("/:id", NbiClearanceController.deleteNbiClearanceById);

module.exports = router;