const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const settingsController = require('../controllers/settingsController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/settings');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.put(
  '/:id',
  upload.fields([
    { name: 'lguLogo', maxCount: 1 },
    { name: 'lguAuthLogo', maxCount: 1 },
    { name: 'lguOrgStructure', maxCount: 1 }
  ]),
  settingsController.updateSettings
);

// Add this route for getting settings by ID
router.get('/:id', settingsController.getSettingsById);
router.get('/', settingsController.getAllSettings);

module.exports = router;
