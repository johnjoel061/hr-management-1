const MarriageContract = require("../models/marriageContractModel");
const createError = require("../utils/appError");
const upload = require("../utils/marriageContractMulterConfig");
const fs = require('fs');
const path = require('path');

// Normalize file paths to use forward slashes
function normalizeFilePaths(filePaths) {
  return filePaths.map(filePath => filePath.replace(/\\/g, '/'));
}

exports.addMarriageContract = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new createError(err, 400));
    }

    try {
      const { marFirstName, marLastName, marMiddleName, marSuffix } = req.body;

       // Get and normalize paths of uploaded files
       const marScannedPicture = req.files ? normalizeFilePaths(req.files.map(file => file.path)) : [];
      
      // Create new Personal Data Sheet
      const newMarriageContract = new MarriageContract({
        marFirstName,
        marLastName,
        marMiddleName,
        marSuffix,
        marScannedPicture, // Save the file path to the database
      });

      // Save the new Personal Data Sheet to the database
      await newMarriageContract.save();

      // Respond with success message
      res.status(201).json({
        status: "success",
        message: "Marriage Contract added successfully",
        data: {
            marriageContract: newMarriageContract,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};

// Controller to get all PDS
exports.getAllMarriageContract = async (req, res, next) => {
  try {
    const marriageContract = await MarriageContract.find();

    const dataWithImageUrls = marriageContract.map((mar) => {
      const imageUrl = mar.marScannedPicture.map((filePath) => {
        // Replace backslashes with forward slashes
        const normalizedPath = filePath.replace(/\\/g, '/');
        return `${req.protocol}://${req.get('host')}/${normalizedPath}`;
      });

      return {
        _id: mar._id,
        marLastName: mar.marLastName,
        marFirstName: mar.marFirstName,
        marMiddleName: mar.marMiddleName,
        marSuffix: mar.marSuffix,
        marScannedPicture: imageUrl, // Provide the image URLs for the frontend
        createdAt: mar.createdAt,
        updatedAt: mar.updatedAt,
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
exports.getMarriageContractById = async (req, res, next) => {
  try {
    const marriageContract = await MarriageContract.findById(req.params.id);

    if (!marriageContract) {
      return next(new createError("Marriage Contract not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        marriageContract,
      },
    });
  } catch (error) {
    next(error);
  }
};


exports.updateMarriageContractById = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new createError(err, 400));
    }

    try {
      // Fetch the existing Personal Data Sheet by ID
      const existingMarriageContract = await MarriageContract.findById(req.params.id);
      
      if (!existingMarriageContract) {
        return next(new createError("Marriage Contract not found", 404));
      }

      // Get paths of uploaded files and convert backslashes to forward slashes
      const newMarScannedPictures = req.files.map(file => file.path.replace(/\\/g, '/'));

      // Combine the old and new image paths
      const combinedMarScannedPictures = [
        ...existingMarriageContract.marScannedPicture,
        ...newMarScannedPictures,
      ];

      // Update the Personal Data Sheet with the new data and combined file paths
      const { marFirstName, marLastName, marMiddleName, marSuffix } = req.body;
      const updatedMarriageContract = await MarriageContract.findByIdAndUpdate(
        req.params.id,
        {
          marFirstName,
          marLastName,
          marMiddleName,
          marSuffix,
          marScannedPicture: combinedMarScannedPictures,
        },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        status: "success",
        message: "Marriage Contract updated successfully",
        data: {
          _id: updatedMarriageContract._id,
          marLastName: updatedMarriageContract.marLastName,
          marFirstName: updatedMarriageContract.marFirstName,
          marMiddleName: updatedMarriageContract.marMiddleName,
          marSuffix: updatedMarriageContract.marSuffix,
          marScannedPicture: updatedMarriageContract.marScannedPicture,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};


// Controller to delete PDS by ID
exports.deleteMarriageContractById = async (req, res, next) => {
  try {
    const deletedMarriageContract = await MarriageContract.findByIdAndDelete(req.params.id);

    if (!deletedMarriageContract) {
      return next(new createError("Marriage Contract not found", 404));
    }

    // Delete the picture files from the filesystem
    deletedMarriageContract.marScannedPicture.forEach(picturePath => {
      const fullPath = path.join(__dirname, '..', picturePath);
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error("Failed to delete Marriage Contract:", err);
        }
      });
    });

    res.status(200).json({
      status: "success",
      message: "Marriage Contract deleted successfully",
      data: {
        _id: deletedMarriageContract._id,
        marLastName: deletedMarriageContract.marLastName,
        marFirstName: deletedMarriageContract.marFirstName,
        marSuffix: deletedMarriageContract.marSuffix,
        marScannedPicture: deletedMarriageContract.marScannedPicture,
      },
    });
  } catch (error) {
    next(error);
  }
};



