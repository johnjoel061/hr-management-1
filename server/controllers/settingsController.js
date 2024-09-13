const mongoose = require('mongoose');
const Settings = require("../models/settingsModel");
const path = require('path');
const fs = require('fs');

// Utility function to handle file deletion
const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Failed to delete file: ${err}`);
      }
    });
  }
};

// Update Settings
exports.updateSettings = async (req, res) => {
  try {
    const { id } = req.params;
    const { lguName, lguGmail } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'ID is required' });
    }

    const settings = await Settings.findById(id);
    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }

    // Update text fields
    if (lguName) settings.lguName = lguName;
    if (lguGmail) settings.lguGmail = lguGmail;

    // Update image fields if files are provided
    const updateImageField = (fieldName, fileKey) => {
      if (req.files && req.files[fileKey]) {
        const previousFilePath = path.join(__dirname, '..', 'uploads', 'settings', path.basename(settings[fieldName]));
        deleteFile(previousFilePath);
        settings[fieldName] = `${req.protocol}://${req.get('host')}/uploads/settings/${req.files[fileKey][0].filename}`;
      }
    };

    updateImageField('lguLogo', 'lguLogo');
    updateImageField('lguAuthLogo', 'lguAuthLogo');
    updateImageField('lguOrgStructure', 'lguOrgStructure');

    await settings.save();

    res.status(200).json({ message: 'Settings updated successfully', settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};


// Get Settings by ID
exports.getSettingsById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'ID is required' });
    }

    const settings = await Settings.findById(id);
    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }

    res.status(200).json({ message: 'Settings retrieved successfully', settings });
  } catch (error) {
    console.error('Error retrieving settings:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};


exports.getAllSettings = async (req, res) => {
  try {
    const settings = await Settings.find();
    res.status(200).json({ message: 'Settings retrieved successfully', settings });
  } catch (error) {
    console.error('Error retrieving settings:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};


