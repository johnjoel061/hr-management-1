const express = require('express');
const router = express.Router();
const PersonalDataSheetController = require('../controllers/PersonalDataSheetController');
const multer = require('multer');

router.post('/add', PersonalDataSheetController.addPersonalDataSheet);
router.get("/all", PersonalDataSheetController.getAllPersonalDataSheet);
router.get("/:id", PersonalDataSheetController.getPersonalDataSheetById);
router.put("/:id", PersonalDataSheetController.updatePersonalDataSheetById);
router.delete("/:id", PersonalDataSheetController.deletePersonalDataSheetById);

module.exports = router;