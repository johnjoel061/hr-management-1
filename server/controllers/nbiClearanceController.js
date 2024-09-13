const NbiClearance = require("../models/nbiClearanceModel");
const createError = require("../utils/appError");
const upload = require("../utils/nbiClearanceMulterConfig");
const fs = require('fs');
const path = require('path');

// Normalize file paths to use forward slashes
function normalizeFilePaths(filePaths) {
  return filePaths.map(filePath => filePath.replace(/\\/g, '/'));
}

exports.addNbiClearance = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new createError(err, 400));
    }

    try {
      const { nbiFirstName, nbiLastName, nbiMiddleName, nbiSuffix } = req.body;

       // Get and normalize paths of uploaded files
       const nbiScannedPicture = req.files ? normalizeFilePaths(req.files.map(file => file.path)) : [];
      
      // Create new Personal Data Sheet
      const newNbiClearance = new NbiClearance({
        nbiFirstName,
        nbiLastName,
        nbiMiddleName,
        nbiSuffix,
        nbiScannedPicture, // Save the file path to the database
      });

      // Save the new Personal Data Sheet to the database
      await newNbiClearance.save();

      // Respond with success message
      res.status(201).json({
        status: "success",
        message: "NBI Clearance added successfully",
        data: {
          nbiClearance: newNbiClearance,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};

// Controller to get all PDS
exports.getAllNbiClearance = async (req, res, next) => {
  try {
    const nbiClearance = await NbiClearance.find();

    const dataWithImageUrls = nbiClearance.map((nbi) => {
      const imageUrl = nbi.nbiScannedPicture.map((filePath) => {
        // Replace backslashes with forward slashes
        const normalizedPath = filePath.replace(/\\/g, '/');
        return `${req.protocol}://${req.get('host')}/${normalizedPath}`;
      });

      return {
        _id: nbi._id,
        nbiLastName: nbi.nbiLastName,
        nbiFirstName: nbi.nbiFirstName,
        nbiMiddleName: nbi.nbiMiddleName,
        nbiSuffix: nbi.nbiSuffix,
        nbiScannedPicture: imageUrl, // Provide the image URLs for the frontend
        createdAt: nbi.createdAt,
        updatedAt: nbi.updatedAt,
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
exports.getNbiClearanceById = async (req, res, next) => {
  try {
    const nbiClearance = await NbiClearance.findById(req.params.id);

    if (!nbiClearance) {
      return next(new createError("NBI Clearance not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        nbiClearance,
      },
    });
  } catch (error) {
    next(error);
  }
};


exports.updateNbiClearanceById = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new createError(err, 400));
    }

    try {
      // Fetch the existing Personal Data Sheet by ID
      const existingNbiClearance = await NbiClearance.findById(req.params.id);
      
      if (!existingNbiClearance) {
        return next(new createError("NBI Clearance not found", 404));
      }

      // Get paths of uploaded files and convert backslashes to forward slashes
      const newNbiScannedPictures = req.files.map(file => file.path.replace(/\\/g, '/'));

      // Combine the old and new image paths
      const combinedNbiScannedPictures = [
        ...existingNbiClearance.nbiScannedPicture,
        ...newNbiScannedPictures,
      ];

      // Update the Personal Data Sheet with the new data and combined file paths
      const { nbiFirstName, nbiLastName, nbiMiddleName, nbiSuffix } = req.body;
      const updatedNbiClearance = await NbiClearance.findByIdAndUpdate(
        req.params.id,
        {
          nbiFirstName,
          nbiLastName,
          nbiMiddleName,
          nbiSuffix,
          nbiScannedPicture: combinedNbiScannedPictures,
        },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        status: "success",
        message: "NBI Clearance updated successfully",
        data: {
          _id: updatedNbiClearance._id,
          nbiLastName: updatedNbiClearance.nbiLastName,
          nbiFirstName: updatedNbiClearance.nbiFirstName,
          nbiMiddleName: updatedNbiClearance.nbiMiddleName,
          nbiSuffix: updatedNbiClearance.nbiSuffix,
          nbiScannedPicture: updatedNbiClearance.nbiScannedPicture,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};


// Controller to delete PDS by ID
exports.deleteNbiClearanceById = async (req, res, next) => {
  try {
    const deletedNbiClearance = await NbiClearance.findByIdAndDelete(req.params.id);

    if (!deletedNbiClearance) {
      return next(new createError("NBI Clearance not found", 404));
    }

    // Delete the picture files from the filesystem
    deletedNbiClearance.nbiScannedPicture.forEach(picturePath => {
      const fullPath = path.join(__dirname, '..', picturePath);
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error("Failed to delete NBI Clearance:", err);
        }
      });
    });

    res.status(200).json({
      status: "success",
      message: "NBI Clearance deleted successfully",
      data: {
        _id: deletedNbiClearance._id,
        nbiLastName: deletedNbiClearance.nbiLastName,
        nbiFirstName: deletedNbiClearance.nbiFirstName,
        nbiSuffix: deletedNbiClearance.nbiSuffix,
        nbiScannedPicture: deletedNbiClearance.nbiScannedPicture,
      },
    });
  } catch (error) {
    next(error);
  }
};



