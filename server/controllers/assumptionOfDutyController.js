const AssumptionOfDuty = require("../models/assumptionOfDutyModel");
const createError = require("../utils/appError");
const upload = require("../utils/assumptionOfDutyMulterConfig");
const fs = require('fs');
const path = require('path');

// Normalize file paths to use forward slashes
function normalizeFilePaths(filePaths) {
  return filePaths.map(filePath => filePath.replace(/\\/g, '/'));
}

exports.addAssumptionOfDuty = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new createError(err, 400));
    }

    try {
      const { assFirstName, assLastName, assMiddleName, assSuffix } = req.body;

       // Get and normalize paths of uploaded files
       const assScannedPicture = req.files ? normalizeFilePaths(req.files.map(file => file.path)) : [];
      
      // Create new Personal Data Sheet
      const newAssumptionOfDuty = new AssumptionOfDuty({
        assFirstName,
        assLastName,
        assMiddleName,
        assSuffix,
        assScannedPicture, // Save the file path to the database
      });

      // Save the new Personal Data Sheet to the database
      await newAssumptionOfDuty.save();

      // Respond with success message
      res.status(201).json({
        status: "success",
        message: "Assumption Of Duty added successfully",
        data: {
            assumptionOfDuty: newAssumptionOfDuty,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};

// Controller to get all PDS
exports.getAllAssumptionOfDuty = async (req, res, next) => {
  try {
    const assumptionOfDuty = await AssumptionOfDuty.find();

    const dataWithImageUrls = assumptionOfDuty.map((ass) => {
      const imageUrl = ass.assScannedPicture.map((filePath) => {
        // Replace backslashes with forward slashes
        const normalizedPath = filePath.replace(/\\/g, '/');
        return `${req.protocol}://${req.get('host')}/${normalizedPath}`;
      });

      return {
        _id: ass._id,
        assLastName: ass.assLastName,
        assFirstName: ass.assFirstName,
        assMiddleName: ass.assMiddleName,
        assSuffix: ass.assSuffix,
        assScannedPicture: imageUrl, // Provide the image URLs for the frontend
        createdAt: ass.createdAt,
        updatedAt: ass.updatedAt,
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
exports.getAssumptionOfDutyById = async (req, res, next) => {
  try {
    const assumptionOfDuty = await AssumptionOfDuty.findById(req.params.id);

    if (!assumptionOfDuty) {
      return next(new createError("Assumption of duty not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        assumptionOfDuty,
      },
    });
  } catch (error) {
    next(error);
  }
};


exports.updateAssumptionOfDutyById = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new createError(err, 400));
    }

    try {
      // Fetch the existing Personal Data Sheet by ID
      const existingAssumptionOfDuty = await AssumptionOfDuty.findById(req.params.id);
      
      if (!existingAssumptionOfDuty) {
        return next(new createError("Assumption of duty not found", 404));
      }

      // Get paths of uploaded files and convert backslashes to forward slashes
      const newAssScannedPictures = req.files.map(file => file.path.replace(/\\/g, '/'));

      // Combine the old and new image paths
      const combinedAssScannedPictures = [
        ...existingAssumptionOfDuty.assScannedPicture,
        ...newAssScannedPictures,
      ];

      // Update the Personal Data Sheet with the new data and combined file paths
      const { assFirstName, assLastName, assMiddleName, assSuffix } = req.body;
      const updatedAssumptionOfDuty = await AssumptionOfDuty.findByIdAndUpdate(
        req.params.id,
        {
          assFirstName,
          assLastName,
          assMiddleName,
          assSuffix,
          assScannedPicture: combinedAssScannedPictures,
        },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        status: "success",
        message: "Assumption of duty updated successfully",
        data: {
          _id: updatedAssumptionOfDuty._id,
          assLastName: updatedAssumptionOfDuty.assLastName,
          assFirstName: updatedAssumptionOfDuty.assFirstName,
          assMiddleName: updatedAssumptionOfDuty.assMiddleName,
          assSuffix: updatedAssumptionOfDuty.assSuffix,
          assScannedPicture: updatedAssumptionOfDuty.assScannedPicture,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};


// Controller to delete PDS by ID
exports.deleteAssumptionOfDutyById = async (req, res, next) => {
  try {
    const deletedAssumptionOfDuty = await AssumptionOfDuty.findByIdAndDelete(req.params.id);

    if (!deletedAssumptionOfDuty) {
      return next(new createError("Assumption of duty not found", 404));
    }

    // Delete the picture files from the filesystem
    deletedAssumptionOfDuty.assScannedPicture.forEach(picturePath => {
      const fullPath = path.join(__dirname, '..', picturePath);
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error("Failed to delete assumption Of duty:", err);
        }
      });
    });

    res.status(200).json({
      status: "success",
      message: "Assumption of duty deleted successfully",
      data: {
        _id: deletedAssumptionOfDuty._id,
        assLastName: deletedAssumptionOfDuty.assLastName,
        assFirstName: deletedAssumptionOfDuty.assFirstName,
        assSuffix: deletedAssumptionOfDuty.assSuffix,
        assScannedPicture: deletedAssumptionOfDuty.assScannedPicture,
      },
    });
  } catch (error) {
    next(error);
  }
};



