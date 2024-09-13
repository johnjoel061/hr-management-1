const Tor = require("../models/torModel");
const createError = require("../utils/appError");
const upload = require("../utils/torMulterConfig");
const fs = require('fs');
const path = require('path');

// Normalize file paths to use forward slashes
function normalizeFilePaths(filePaths) {
  return filePaths.map(filePath => filePath.replace(/\\/g, '/'));
}

exports.addTor = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new createError(err, 400));
    }

    try {
      const { torFirstName, torLastName, torMiddleName, torSuffix } = req.body;

       // Get and normalize paths of uploaded files
       const torScannedPicture = req.files ? normalizeFilePaths(req.files.map(file => file.path)) : [];
      
      // Create new Personal Data Sheet
      const newTor = new Tor({
        torFirstName,
        torLastName,
        torMiddleName,
        torSuffix,
        torScannedPicture, // Save the file path to the database
      });

      // Save the new Personal Data Sheet to the database
      await newTor.save();

      // Respond with success message
      res.status(201).json({
        status: "success",
        message: "TOR added successfully",
        data: {
          tor: newTor,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};

// Controller to get all PDS
exports.getAllTor = async (req, res, next) => {
  try {
    const tor = await Tor.find();

    const dataWithImageUrls = tor.map((tr) => {
      const imageUrl = tr.torScannedPicture.map((filePath) => {
        // Replace backslashes with forward slashes
        const normalizedPath = filePath.replace(/\\/g, '/');
        return `${req.protocol}://${req.get('host')}/${normalizedPath}`;
      });

      return {
        _id: tr._id,
        torLastName: tr.torLastName,
        torFirstName: tr.torFirstName,
        torMiddleName: tr.torMiddleName,
        torSuffix: tr.torSuffix,
        torScannedPicture: imageUrl, // Provide the image URLs for the frontend
        createdAt: tr.createdAt,
        updatedAt: tr.updatedAt,
      };
    });

    res.status(200).json({
      status: "success",
      results: dataWithImageUrls.length,
      data: dataWithImageUrls,
    });
  } catch (error) {
    next(error);
  }
};

// Controller to get PDS by ID
exports.getTorById = async (req, res, next) => {
  try {
    const tor = await Tor.findById(req.params.id);

    if (!tor) {
      return next(new createError("TOR not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        tor,
      },
    });
  } catch (error) {
    next(error);
  }
};


exports.updateTorById = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new createError(err, 400));
    }

    try {
      // Fetch the existing Personal Data Sheet by ID
      const existingTor = await Tor.findById(req.params.id);
      
      if (!existingTor) {
        return next(new createError("Tor not found", 404));
      }

      // Get paths of uploaded files and convert backslashes to forward slashes
      const newTorScannedPictures = req.files.map(file => file.path.replace(/\\/g, '/'));

      // Combine the old and new image paths
      const combinedTorScannedPictures = [
        ...existingTor.torScannedPicture,
        ...newTorScannedPictures,
      ];

      // Update the Personal Data Sheet with the new data and combined file paths
      const { torFirstName, torLastName, torMiddleName, torSuffix } = req.body;
      const updatedTor = await Tor.findByIdAndUpdate(
        req.params.id,
        {
          torFirstName,
          torLastName,
          torMiddleName,
          torSuffix,
          torScannedPicture: combinedTorScannedPictures,
        },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        status: "success",
        message: "TOR updated successfully",
        data: {
          _id: updatedTor._id,
          torLastName: updatedTor.torLastName,
          torFirstName: updatedTor.torFirstName,
          torMiddleName: updatedTor.torMiddleName,
          torSuffix: updatedTor.torSuffix,
          torScannedPicture: updatedTor.torScannedPicture,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};


// Controller to delete PDS by ID
exports.deleteTorById = async (req, res, next) => {
  try {
    const deletedTor = await Tor.findByIdAndDelete(req.params.id);

    if (!deletedTor) {
      return next(new createError("TOR not found", 404));
    }

    // Delete the picture files from the filesystem
    deletedTor.torScannedPicture.forEach(picturePath => {
      const fullPath = path.join(__dirname, '..', picturePath);
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error("Failed to delete TOR:", err);
        }
      });
    });

    res.status(200).json({
      status: "success",
      message: "TOR deleted successfully",
      data: {
        _id: deletedTor._id,
        torLastName: deletedTor.torLastName,
        torFirstName: deletedTor.torFirstName,
        torSuffix: deletedTor.torSuffix,
        torScannedPicture: deletedTor.torScannedPicture,
      },
    });
  } catch (error) {
    next(error);
  }
};



