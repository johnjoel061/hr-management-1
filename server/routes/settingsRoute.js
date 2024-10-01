const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const settingsController = require('../controllers/settingsController');

// Ensure that the 'uploads/settings' directory exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'settings');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the upload directory
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create a unique filename with the original extension
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit the file size to 5MB
  fileFilter: (req, file, cb) => {
    // Accept only certain file types (e.g., JPEG, PNG)
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPEG and PNG images are allowed.'));
    }
  }
});

// Define the route for updating settings with file uploads
router.put(
  '/:id',
  upload.fields([
    { name: 'lguLogo', maxCount: 1 },
    { name: 'lguAuthLogo', maxCount: 1 },
    { name: 'lguOrgStructure', maxCount: 1 }
  ]),
  async (req, res, next) => {
    try {
      // Pass the request to the controller
      await settingsController.updateSettings(req, res);
    } catch (error) {
      console.error('Error during settings update:', error);
      res.status(500).json({ message: 'Error updating settings', error: error.message });
    }
  }
);

// Define routes to retrieve settings by ID or all settings
router.get('/:id', settingsController.getSettingsById);
router.get('/', settingsController.getAllSettings);

module.exports = router;
