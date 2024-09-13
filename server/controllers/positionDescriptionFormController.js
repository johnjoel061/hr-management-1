const PositionDescriptionForm = require("../models/positionDescriptionFormModel");
const createError = require("../utils/appError");
const upload = require("../utils/positionDescriptionFormMulterConfig");
const fs = require('fs');
const path = require('path');

// Normalize file paths to use forward slashes
function normalizeFilePaths(filePaths) {
  return filePaths.map(filePath => filePath.replace(/\\/g, '/'));
}

exports.addAPositionDescriptionForm = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new createError(err, 400));
    }

    try {
      const { posFirstName, posLastName, posMiddleName, posSuffix } = req.body;

       // Get and normalize paths of uploaded files
       const posScannedPicture = req.files ? normalizeFilePaths(req.files.map(file => file.path)) : [];
      
      // Create new Personal Data Sheet
      const newPositionDescriptionForm = new PositionDescriptionForm({
        posFirstName,
        posLastName,
        posMiddleName,
        posSuffix,
        posScannedPicture, // Save the file path to the database
      });

      // Save the new Personal Data Sheet to the database
      await newPositionDescriptionForm.save();

      // Respond with success message
      res.status(201).json({
        status: "success",
        message: "Position Description Form added successfully",
        data: {
          positionDescriptionForm: newPositionDescriptionForm,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};

// Controller to get all PDS
exports.getAllPositionDescriptionForm = async (req, res, next) => {
  try {
    const positionDescriptionForm = await PositionDescriptionForm.find();

    const dataWithImageUrls = positionDescriptionForm.map((pos) => {
      const imageUrl = pos.posScannedPicture.map((filePath) => {
        // Replace backslashes with forward slashes
        const normalizedPath = filePath.replace(/\\/g, '/');
        return `${req.protocol}://${req.get('host')}/${normalizedPath}`;
      });

      return {
        _id: pos._id,
        posLastName: pos.posLastName,
        posFirstName: pos.posFirstName,
        posMiddleName: pos.posMiddleName,
        posSuffix: pos.posSuffix,
        posScannedPicture: imageUrl, // Provide the image URLs for the frontend
        createdAt: pos.createdAt,
        updatedAt: pos.updatedAt,
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
exports.getPositionDescriptionFormById = async (req, res, next) => {
  try {
    const positionDescriptionForm = await PositionDescriptionForm.findById(req.params.id);

    if (!positionDescriptionForm) {
      return next(new createError("Position Description Form not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        positionDescriptionForm,
      },
    });
  } catch (error) {
    next(error);
  }
};


exports.updatePositionDescriptionFormById = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new createError(err, 400));
    }

    try {
      // Fetch the existing Personal Data Sheet by ID
      const existingPositionDescriptionForm = await PositionDescriptionForm.findById(req.params.id);
      
      if (!existingPositionDescriptionForm) {
        return next(new createError("Position Description Form not found", 404));
      }

      // Get paths of uploaded files and convert backslashes to forward slashes
      const newPosScannedPictures = req.files.map(file => file.path.replace(/\\/g, '/'));

      // Combine the old and new image paths
      const combinedPosScannedPictures = [
        ...existingPositionDescriptionForm.posScannedPicture,
        ...newPosScannedPictures,
      ];

      // Update the Personal Data Sheet with the new data and combined file paths
      const { posFirstName, posLastName, posMiddleName, posSuffix } = req.body;
      const updatedPositionDescriptionForm = await PositionDescriptionForm.findByIdAndUpdate(
        req.params.id,
        {
          posFirstName,
          posLastName,
          posMiddleName,
          posSuffix,
          posScannedPicture: combinedPosScannedPictures,
        },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        status: "success",
        message: "Position Description Form updated successfully",
        data: {
          _id: updatedPositionDescriptionForm._id,
          posLastName: updatedPositionDescriptionForm.posLastName,
          posFirstName: updatedPositionDescriptionForm.posFirstName,
          posMiddleName: updatedPositionDescriptionForm.posMiddleName,
          posSuffix: updatedPositionDescriptionForm.posSuffix,
          posScannedPicture: updatedPositionDescriptionForm.posScannedPicture,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};


// Controller to delete PDS by ID
exports.deletePositionDescriptionFormById = async (req, res, next) => {
  try {
    const deletedPositionDescriptionForm = await PositionDescriptionForm.findByIdAndDelete(req.params.id);

    if (!deletedPositionDescriptionForm) {
      return next(new createError("Appointment not found", 404));
    }

    // Delete the picture files from the filesystem
    deletedPositionDescriptionForm.posScannedPicture.forEach(picturePath => {
      const fullPath = path.join(__dirname, '..', picturePath);
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error("Failed to delete Position Description Form:", err);
        }
      });
    });

    res.status(200).json({
      status: "success",
      message: "Position Description Form deleted successfully",
      data: {
        _id: deletedPositionDescriptionForm._id,
        posLastName: deletedPositionDescriptionForm.posLastName,
        posFirstName: deletedPositionDescriptionForm.posFirstName,
        posSuffix: deletedPositionDescriptionForm.posSuffix,
        posScannedPicture: deletedPositionDescriptionForm.posScannedPicture,
      },
    });
  } catch (error) {
    next(error);
  }
};



