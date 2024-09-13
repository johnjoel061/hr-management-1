const BirthCertificate = require("../models/birthCertificateModel");
const createError = require("../utils/appError");
const upload = require("../utils/birthCertificateMulterConfig");
const fs = require('fs');
const path = require('path');

// Normalize file paths to use forward slashes
function normalizeFilePaths(filePaths) {
  return filePaths.map(filePath => filePath.replace(/\\/g, '/'));
}

exports.addBirthCertificate = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new createError(err, 400));
    }

    try {
      const { birFirstName, birLastName, birMiddleName, birSuffix } = req.body;

       // Get and normalize paths of uploaded files
       const birScannedPicture = req.files ? normalizeFilePaths(req.files.map(file => file.path)) : [];
      
      // Create new Personal Data Sheet
      const newBirthCertificate = new BirthCertificate({
        birFirstName,
        birLastName,
        birMiddleName,
        birSuffix,
        birScannedPicture, // Save the file path to the database
      });

      // Save the new Personal Data Sheet to the database
      await newBirthCertificate.save();

      // Respond with success message
      res.status(201).json({
        status: "success",
        message: "Birth Certificate added successfully",
        data: {
            birthCertificate: newBirthCertificate,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};

// Controller to get all PDS
exports.getAllBirthCertificate = async (req, res, next) => {
  try {
    const birthCertificate = await BirthCertificate.find();

    const dataWithImageUrls = birthCertificate.map((bir) => {
      const imageUrl = bir.birScannedPicture.map((filePath) => {
        // Replace backslashes with forward slashes
        const normalizedPath = filePath.replace(/\\/g, '/');
        return `${req.protocol}://${req.get('host')}/${normalizedPath}`;
      });

      return {
        _id: bir._id,
        birLastName: bir.birLastName,
        birFirstName: bir.birFirstName,
        birMiddleName: bir.birMiddleName,
        birSuffix: bir.birSuffix,
        birScannedPicture: imageUrl, // Provide the image URLs for the frontend
        createdAt: bir.createdAt,
        updatedAt: bir.updatedAt,
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
exports.getBirthCertificateById = async (req, res, next) => {
  try {
    const birthCertificate = await BirthCertificate.findById(req.params.id);

    if (!birthCertificate) {
      return next(new createError("Birth Certificate not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        birthCertificate,
      },
    });
  } catch (error) {
    next(error);
  }
};


exports.updateBirthCertificateById = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new createError(err, 400));
    }

    try {
      // Fetch the existing Personal Data Sheet by ID
      const existingBirthCertificate = await BirthCertificate.findById(req.params.id);
      
      if (!existingBirthCertificate) {
        return next(new createError("Birth Certificate not found", 404));
      }

      // Get paths of uploaded files and convert backslashes to forward slashes
      const newBirScannedPictures = req.files.map(file => file.path.replace(/\\/g, '/'));

      // Combine the old and new image paths
      const combinedBirScannedPictures = [
        ...existingBirthCertificate.birScannedPicture,
        ...newBirScannedPictures,
      ];

      // Update the Personal Data Sheet with the new data and combined file paths
      const { birFirstName, birLastName, birMiddleName, birSuffix } = req.body;
      const updatedBirthCertificate = await BirthCertificate.findByIdAndUpdate(
        req.params.id,
        {
          birFirstName,
          birLastName,
          birMiddleName,
          birSuffix,
          birScannedPicture: combinedBirScannedPictures,
        },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        status: "success",
        message: "Birth Certificate updated successfully",
        data: {
          _id: updatedBirthCertificate._id,
          birLastName: updatedBirthCertificate.birLastName,
          birFirstName: updatedBirthCertificate.birFirstName,
          birMiddleName: updatedBirthCertificate.birMiddleName,
          birSuffix: updatedBirthCertificate.birSuffix,
          birScannedPicture: updatedBirthCertificate.birScannedPicture,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};


// Controller to delete PDS by ID
exports.deleteBirthCertificateById = async (req, res, next) => {
  try {
    const deletedBirthCertificate = await BirthCertificate.findByIdAndDelete(req.params.id);

    if (!deletedBirthCertificate) {
      return next(new createError("Birth Certificate not found", 404));
    }

    // Delete the picture files from the filesystem
    deletedBirthCertificate.birScannedPicture.forEach(picturePath => {
      const fullPath = path.join(__dirname, '..', picturePath);
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error("Failed to delete Birth Certificate:", err);
        }
      });
    });

    res.status(200).json({
      status: "success",
      message: "Birth Certificate deleted successfully",
      data: {
        _id: deletedBirthCertificate._id,
        birLastName: deletedBirthCertificate.birLastName,
        birFirstName: deletedBirthCertificate.birFirstName,
        birSuffix: deletedBirthCertificate.birSuffix,
        birScannedPicture: deletedBirthCertificate.birScannedPicture,
      },
    });
  } catch (error) {
    next(error);
  }
};



