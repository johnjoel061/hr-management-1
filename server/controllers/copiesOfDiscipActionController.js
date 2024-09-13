const CopiesOfDiscipAction = require("../models/copiesOfDiscipActionModel");
const createError = require("../utils/appError");
const upload = require("../utils/copiesOfDicipActionMulterConfig");
const fs = require('fs');
const path = require('path');

// Normalize file paths to use forward slashes
function normalizeFilePaths(filePaths) {
  return filePaths.map(filePath => filePath.replace(/\\/g, '/'));
}

exports.addCopiesOfDiscipAction = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new createError(err, 400));
    }

    try {
      const { copFirstName, copLastName, copMiddleName, copSuffix } = req.body;

       // Get and normalize paths of uploaded files
       const copScannedPicture = req.files ? normalizeFilePaths(req.files.map(file => file.path)) : [];
      
      // Create new Personal Data Sheet
      const newCopiesOfDiscipAction = new CopiesOfDiscipAction({
        copFirstName,
        copLastName,
        copMiddleName,
        copSuffix,
        copScannedPicture, // Save the file path to the database
      });

      // Save the new Personal Data Sheet to the database
      await newCopiesOfDiscipAction.save();

      // Respond with success message
      res.status(201).json({
        status: "success",
        message: "Copies of Disciplinary Action  added successfully",
        data: {
            copiesOfDiscipAction: newCopiesOfDiscipAction,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};

// Controller to get all PDS
exports.getAllCopiesOfDiscipAction = async (req, res, next) => {
  try {
    const copiesOfDiscipAction = await CopiesOfDiscipAction.find();

    const dataWithImageUrls = copiesOfDiscipAction.map((cop) => {
      const imageUrl = cop.copScannedPicture.map((filePath) => {
        // Replace backslashes with forward slashes
        const normalizedPath = filePath.replace(/\\/g, '/');
        return `${req.protocol}://${req.get('host')}/${normalizedPath}`;
      });

      return {
        _id: cop._id,
        copLastName: cop.copLastName,
        copFirstName: cop.copFirstName,
        copMiddleName: cop.copMiddleName,
        copSuffix: cop.copSuffix,
        copScannedPicture: imageUrl, // Provide the image URLs for the frontend
        createdAt: cop.createdAt,
        updatedAt: cop.updatedAt,
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
exports.getCopiesOfDiscipActionById = async (req, res, next) => {
  try {
    const copiesOfDiscipAction = await CopiesOfDiscipAction.findById(req.params.id);

    if (!copiesOfDiscipAction) {
      return next(new createError("Copies of Disciplinary Action not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        copiesOfDiscipAction,
      },
    });
  } catch (error) {
    next(error);
  }
};


exports.updateCopiesOfDiscipActionById = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new createError(err, 400));
    }

    try {
      // Fetch the existing Personal Data Sheet by ID
      const existingCopiesOfDiscipAction = await CopiesOfDiscipAction.findById(req.params.id);
      
      if (!existingCopiesOfDiscipAction) {
        return next(new createError("Copies of Disciplinary Action not found", 404));
      }

      // Get paths of uploaded files and convert backslashes to forward slashes
      const newCopScannedPictures = req.files.map(file => file.path.replace(/\\/g, '/'));

      // Combine the old and new image paths
      const combinedCopScannedPictures = [
        ...existingCopiesOfDiscipAction.copScannedPicture,
        ...newCopScannedPictures,
      ];

      // Update the Personal Data Sheet with the new data and combined file paths
      const { copFirstName, copLastName, copMiddleName, copSuffix } = req.body;
      const updatedCopiesOfDiscipAction = await CopiesOfDiscipAction.findByIdAndUpdate(
        req.params.id,
        {
          copFirstName,
          copLastName,
          copMiddleName,
          copSuffix,
          copScannedPicture: combinedCopScannedPictures,
        },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        status: "success",
        message: "Copies of Disciplinary Action updated successfully",
        data: {
          _id: updatedCopiesOfDiscipAction._id,
          copLastName: updatedCopiesOfDiscipAction.copLastName,
          copFirstName: updatedCopiesOfDiscipAction.copFirstName,
          copMiddleName: updatedCopiesOfDiscipAction.copMiddleName,
          copSuffix: updatedCopiesOfDiscipAction.copSuffix,
          copScannedPicture: updatedCopiesOfDiscipAction.copScannedPicture,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};


// Controller to delete PDS by ID
exports.deleteCopiesOfDiscipActionById = async (req, res, next) => {
  try {
    const deletedCopiesOfDiscipAction = await CopiesOfDiscipAction.findByIdAndDelete(req.params.id);

    if (!deletedCopiesOfDiscipAction) {
      return next(new createError("Copies of Disciplinary Action not found", 404));
    }

    // Delete the picture files from the filesystem
    deletedCopiesOfDiscipAction.copScannedPicture.forEach(picturePath => {
      const fullPath = path.join(__dirname, '..', picturePath);
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error("Failed to delete Copies of Disciplinary Action:", err);
        }
      });
    });

    res.status(200).json({
      status: "success",
      message: "Copies of Disciplinary Action deleted successfully",
      data: {
        _id: deletedCopiesOfDiscipAction._id,
        copLastName: deletedCopiesOfDiscipAction.copLastName,
        copFirstName: deletedCopiesOfDiscipAction.copFirstName,
        copSuffix: deletedCopiesOfDiscipAction.copSuffix,
        copScannedPicture: deletedCopiesOfDiscipAction.copScannedPicture,
      },
    });
  } catch (error) {
    next(error);
  }
};



