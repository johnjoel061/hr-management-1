const OathOfOffice = require("../models/oathOfOfficeModel");
const createError = require("../utils/appError");
const upload = require("../utils/oathOfOfficeMulterConfig");
const fs = require('fs');
const path = require('path');

// Normalize file paths to use forward slashes
function normalizeFilePaths(filePaths) {
  return filePaths.map(filePath => filePath.replace(/\\/g, '/'));
}

exports.addOathOfOffice = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new createError(err, 400));
    }

    try {
      const { oatFirstName, oatLastName, oatMiddleName, oatSuffix } = req.body;

       // Get and normalize paths of uploaded files
       const oatScannedPicture = req.files ? normalizeFilePaths(req.files.map(file => file.path)) : [];
      
      // Create new Personal Data Sheet
      const newOathOfOffice = new OathOfOffice({
        oatFirstName,
        oatLastName,
        oatMiddleName,
        oatSuffix,
        oatScannedPicture, // Save the file path to the database
      });

      // Save the new Personal Data Sheet to the database
      await newOathOfOffice.save();

      // Respond with success message
      res.status(201).json({
        status: "success",
        message: "Oath of Office added successfully",
        data: {
            oathOfOffice: newOathOfOffice,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};

// Controller to get all PDS
exports.getAllOathOfOffice = async (req, res, next) => {
  try {
    const oathOfOffice = await OathOfOffice.find();

    const dataWithImageUrls = oathOfOffice.map((oat) => {
      const imageUrl = oat.oatScannedPicture.map((filePath) => {
        // Replace backslashes with forward slashes
        const normalizedPath = filePath.replace(/\\/g, '/');
        return `${req.protocol}://${req.get('host')}/${normalizedPath}`;
      });

      return {
        _id: oat._id,
        oatLastName: oat.oatLastName,
        oatFirstName: oat.oatFirstName,
        oatMiddleName: oat.oatMiddleName,
        oatSuffix: oat.oatSuffix,
        oatScannedPicture: imageUrl, // Provide the image URLs for the frontend
        createdAt: oat.createdAt,
        updatedAt: oat.updatedAt,
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
exports.getOathOfOfficeById = async (req, res, next) => {
  try {
    const oathOfOffice = await OathOfOffice.findById(req.params.id);

    if (!oathOfOffice) {
      return next(new createError("Oath Of Office not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        oathOfOffice,
      },
    });
  } catch (error) {
    next(error);
  }
};


exports.updateOathOfOfficeById = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new createError(err, 400));
    }

    try {
      // Fetch the existing Personal Data Sheet by ID
      const existingOathOfOffice = await OathOfOffice.findById(req.params.id);
      
      if (!existingOathOfOffice) {
        return next(new createError("Oath Of Office not found", 404));
      }

      // Get paths of uploaded files and convert backslashes to forward slashes
      const newOatScannedPictures = req.files.map(file => file.path.replace(/\\/g, '/'));

      // Combine the old and new image paths
      const combinedOatScannedPictures = [
        ...existingOathOfOffice.oatScannedPicture,
        ...newOatScannedPictures,
      ];

      // Update the Personal Data Sheet with the new data and combined file paths
      const { oatFirstName, oatLastName, oatMiddleName, oatSuffix } = req.body;
      const updatedOathOfOffice = await OathOfOffice.findByIdAndUpdate(
        req.params.id,
        {
          oatFirstName,
          oatLastName,
          oatMiddleName,
          oatSuffix,
          oatScannedPicture: combinedOatScannedPictures,
        },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        status: "success",
        message: "Oath Of Office updated successfully",
        data: {
          _id: updatedOathOfOffice._id,
          oatLastName: updatedOathOfOffice.oatLastName,
          oatFirstName: updatedOathOfOffice.oatFirstName,
          oatMiddleName: updatedOathOfOffice.oatMiddleName,
          oatSuffix: updatedOathOfOffice.oatSuffix,
          oatScannedPicture: updatedOathOfOffice.oatScannedPicture,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};


// Controller to delete PDS by ID
exports.deleteOathOfOfficeById = async (req, res, next) => {
  try {
    const deletedOathOfOffice = await OathOfOffice.findByIdAndDelete(req.params.id);

    if (!deletedOathOfOffice) {
      return next(new createError("Oath Of Office not found", 404));
    }

    // Delete the picture files from the filesystem
    deletedOathOfOffice.oatScannedPicture.forEach(picturePath => {
      const fullPath = path.join(__dirname, '..', picturePath);
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error("Failed to delete Oath Of Office:", err);
        }
      });
    });

    res.status(200).json({
      status: "success",
      message: "Oath Of Office deleted successfully",
      data: {
        _id: deletedOathOfOffice._id,
        oatLastName: deletedOathOfOffice.oatLastName,
        oatFirstName: deletedOathOfOffice.oatFirstName,
        oatSuffix: deletedOathOfOffice.oatSuffix,
        oatScannedPicture: deletedOathOfOffice.oatScannedPicture,
      },
    });
  } catch (error) {
    next(error);
  }
};



