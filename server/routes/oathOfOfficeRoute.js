const express = require('express');
const router = express.Router();
const OathOfOfficeController = require('../controllers/oathOfOfficeController');

router.post('/add', OathOfOfficeController.addOathOfOffice);
router.get("/all", OathOfOfficeController.getAllOathOfOffice);
router.get("/:id", OathOfOfficeController.getOathOfOfficeById);
router.put("/:id", OathOfOfficeController.updateOathOfOfficeById);
router.delete("/:id", OathOfOfficeController.deleteOathOfOfficeById);

module.exports = router;