const Designation = require("../models/designationModel");
const createError = require("../utils/appError");
const upload = require("../utils/designationMulterConfig");
const fs = require('fs');
const path = require('path');

// Normalize file paths to use forward slashes
function normalizeFilePaths(filePaths) {
  return filePaths.map(filePath => filePath.replace(/\\/g, '/'));
}

exports.addDesignation = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new createError(err, 400));
    }

    try {
      const { desFirstName, desLastName, desMiddleName, desSuffix } = req.body;

       // Get and normalize paths of uploaded files
       const desScannedPicture = req.files ? normalizeFilePaths(req.files.map(file => file.path)) : [];
      
      // Create new Personal Data Sheet
      const newDesignation = new Designation({
        desFirstName,
        desLastName,
        desMiddleName,
        desSuffix,
        desScannedPicture, // Save the file path to the database
      });

      // Save the new Personal Data Sheet to the database
      await newDesignation.save();

      // Respond with success message
      res.status(201).json({
        status: "success",
        message: "Designation added successfully",
        data: {
            designation: newDesignation,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};

// Controller to get all PDS
exports.getAllDesignation = async (req, res, next) => {
  try {
    const designation = await Designation.find();

    const dataWithImageUrls = designation.map((des) => {
      const imageUrl = des.desScannedPicture.map((filePath) => {
        // Replace backslashes with forward slashes
        const normalizedPath = filePath.replace(/\\/g, '/');
        return `${req.protocol}://${req.get('host')}/${normalizedPath}`;
      });

      return {
        _id: des._id,
        desLastName: des.desLastName,
        desFirstName: des.desFirstName,
        desMiddleName: des.desMiddleName,
        desSuffix: des.desSuffix,
        desScannedPicture: imageUrl, // Provide the image URLs for the frontend
        createdAt: des.createdAt,
        updatedAt: des.updatedAt,
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
exports.getDesignationById = async (req, res, next) => {
  try {
    const designation = await Designation.findById(req.params.id);

    if (!designation) {
      return next(new createError("Designation not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        designation,
      },
    });
  } catch (error) {
    next(error);
  }
};


exports.updateDesignationById = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new createError(err, 400));
    }

    try {
      // Fetch the existing Personal Data Sheet by ID
      const existingDesignation = await Designation.findById(req.params.id);
      
      if (!existingDesignation) {
        return next(new createError("Designation not found", 404));
      }

      // Get paths of uploaded files and convert backslashes to forward slashes
      const newDesScannedPictures = req.files.map(file => file.path.replace(/\\/g, '/'));

      // Combine the old and new image paths
      const combinedDesScannedPictures = [
        ...existingDesignation.desScannedPicture,
        ...newDesScannedPictures,
      ];

      // Update the Personal Data Sheet with the new data and combined file paths
      const { desFirstName, desLastName, desMiddleName, desSuffix } = req.body;
      const updatedDesignation = await Designation.findByIdAndUpdate(
        req.params.id,
        {
          desFirstName,
          desLastName,
          desMiddleName,
          desSuffix,
          desScannedPicture: combinedDesScannedPictures,
        },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        status: "success",
        message: "Designation updated successfully",
        data: {
          _id: updatedDesignation._id,
          desLastName: updatedDesignation.desLastName,
          desFirstName: updatedDesignation.desFirstName,
          desMiddleName: updatedDesignation.desMiddleName,
          desSuffix: updatedDesignation.desSuffix,
          desScannedPicture: updatedDesignation.desScannedPicture,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};


// Controller to delete PDS by ID
exports.deleteDesignationById = async (req, res, next) => {
  try {
    const deletedDesignation = await Designation.findByIdAndDelete(req.params.id);

    if (!deletedDesignation) {
      return next(new createError("Designation not found", 404));
    }

    // Delete the picture files from the filesystem
    deletedDesignation.desScannedPicture.forEach(picturePath => {
      const fullPath = path.join(__dirname, '..', picturePath);
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error("Failed to delete Designation:", err);
        }
      });
    });

    res.status(200).json({
      status: "success",
      message: "Designation deleted successfully",
      data: {
        _id: deletedDesignation._id,
        desLastName: deletedDesignation.desLastName,
        desFirstName: deletedDesignation.desFirstName,
        desSuffix: deletedDesignation.desSuffix,
        desScannedPicture: deletedDesignation.desScannedPicture,
      },
    });
  } catch (error) {
    next(error);
  }
};



