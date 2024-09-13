const ClearanceMoneyPropertyAcct = require("../models/clearanceMoneyPropertyAcctModel");
const createError = require("../utils/appError");
const upload = require("../utils/clearanceMoneyPropertyAcctMulterConfig");
const fs = require('fs');
const path = require('path');

// Normalize file paths to use forward slashes
function normalizeFilePaths(filePaths) {
  return filePaths.map(filePath => filePath.replace(/\\/g, '/'));
}

exports.addClearanceMoneyPropertyAcct = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new createError(err, 400));
    }

    try {
      const { cleFirstName, cleLastName, cleMiddleName, cleSuffix } = req.body;

       // Get and normalize paths of uploaded files
       const cleScannedPicture = req.files ? normalizeFilePaths(req.files.map(file => file.path)) : [];
      
      // Create new Personal Data Sheet
      const newClearanceMoneyPropertyAcct = new ClearanceMoneyPropertyAcct({
        cleFirstName,
        cleLastName,
        cleMiddleName,
        cleSuffix,
        cleScannedPicture, // Save the file path to the database
      });

      // Save the new Personal Data Sheet to the database
      await newClearanceMoneyPropertyAcct.save();

      // Respond with success message
      res.status(201).json({
        status: "success",
        message: "Clearance from Money & Property Accountabilities added successfully",
        data: {
            clearanceMoneyPropertyAcct: newClearanceMoneyPropertyAcct,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};

// Controller to get all PDS
exports.getAllClearanceMoneyPropertyAcct = async (req, res, next) => {
  try {
    const clearanceMoneyPropertyAcct = await ClearanceMoneyPropertyAcct.find();

    const dataWithImageUrls = clearanceMoneyPropertyAcct.map((cle) => {
      const imageUrl = cle.cleScannedPicture.map((filePath) => {
        // Replace backslashes with forward slashes
        const normalizedPath = filePath.replace(/\\/g, '/');
        return `${req.protocol}://${req.get('host')}/${normalizedPath}`;
      });

      return {
        _id: cle._id,
        cleLastName: cle.cleLastName,
        cleFirstName: cle.cleFirstName,
        cleMiddleName: cle.cleMiddleName,
        cleSuffix: cle.cleSuffix,
        cleScannedPicture: imageUrl, // Provide the image URLs for the frontend
        createdAt: cle.createdAt,
        updatedAt: cle.updatedAt,
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
exports.getClearanceMoneyPropertyAcctById = async (req, res, next) => {
  try {
    const clearanceMoneyPropertyAcct = await ClearanceMoneyPropertyAcct.findById(req.params.id);

    if (!clearanceMoneyPropertyAcct) {
      return next(new createError("Clearance from Money & Property Accountabilities not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        clearanceMoneyPropertyAcct,
      },
    });
  } catch (error) {
    next(error);
  }
};


exports.updateClearanceMoneyPropertyAcctById = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new createError(err, 400));
    }

    try {
      // Fetch the existing Personal Data Sheet by ID
      const existingClearanceMoneyPropertyAcct = await ClearanceMoneyPropertyAcct.findById(req.params.id);
      
      if (!existingClearanceMoneyPropertyAcct) {
        return next(new createError("Clearance from Money & Property Accountabilities not found", 404));
      }

      // Get paths of uploaded files and convert backslashes to forward slashes
      const newCleScannedPictures = req.files.map(file => file.path.replace(/\\/g, '/'));

      // Combine the old and new image paths
      const combinedPdsScannedPictures = [
        ...existingClearanceMoneyPropertyAcct.cleScannedPicture,
        ...newCleScannedPictures,
      ];

      // Update the Personal Data Sheet with the new data and combined file paths
      const { cleFirstName, cleLastName, cleMiddleName, cleSuffix } = req.body;
      const updatedClearanceMoneyPropertyAcct = await ClearanceMoneyPropertyAcct.findByIdAndUpdate(
        req.params.id,
        {
          cleFirstName,
          cleLastName,
          cleMiddleName,
          cleSuffix,
          cleScannedPicture: combinedPdsScannedPictures,
        },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        status: "success",
        message: "Clearance from Money & Property Accountabilities updated successfully",
        data: {
          _id: updatedClearanceMoneyPropertyAcct._id,
          cleLastName: updatedClearanceMoneyPropertyAcct.cleLastName,
          cleFirstName: updatedClearanceMoneyPropertyAcct.cleFirstName,
          cleMiddleName: updatedClearanceMoneyPropertyAcct.cleMiddleName,
          cleSuffix: updatedClearanceMoneyPropertyAcct.cleSuffix,
          cleScannedPicture: updatedClearanceMoneyPropertyAcct.cleScannedPicture,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};


// Controller to delete PDS by ID
exports.deleteClearanceMoneyPropertyAcctById = async (req, res, next) => {
  try {
    const deletedClearanceMoneyPropertyAcct = await ClearanceMoneyPropertyAcct.findByIdAndDelete(req.params.id);

    if (!deletedClearanceMoneyPropertyAcct) {
      return next(new createError("Clearance from Money & Property Accountabilities not found", 404));
    }

    // Delete the picture files from the filesystem
    deletedClearanceMoneyPropertyAcct.cleScannedPicture.forEach(picturePath => {
      const fullPath = path.join(__dirname, '..', picturePath);
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error("Failed to delete Clearance from Money & Property Accountabilities:", err);
        }
      });
    });

    res.status(200).json({
      status: "success",
      message: "Clearance from Money & Property Accountabilities deleted successfully",
      data: {
        _id: deletedClearanceMoneyPropertyAcct._id,
        cleLastName: deletedClearanceMoneyPropertyAcct.cleLastName,
        cleFirstName: deletedClearanceMoneyPropertyAcct.cleFirstName,
        cleSuffix: deletedClearanceMoneyPropertyAcct.cleSuffix,
        cleScannedPicture: deletedClearanceMoneyPropertyAcct.cleScannedPicture,
      },
    });
  } catch (error) {
    next(error);
  }
};



