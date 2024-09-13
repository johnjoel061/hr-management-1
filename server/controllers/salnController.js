const Saln = require("../models/salnModel");
const createError = require("../utils/appError");
const upload = require("../utils/salnMulterConfig");
const fs = require('fs');
const path = require('path');

// Normalize file paths to use forward slashes
function normalizeFilePaths(filePaths) {
  return filePaths.map(filePath => filePath.replace(/\\/g, '/'));
}

exports.addSaln = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new createError(err, 400));
    }

    try {
      const { salFirstName, salLastName, salMiddleName, salSuffix } = req.body;

       // Get and normalize paths of uploaded files
       const salScannedPicture = req.files ? normalizeFilePaths(req.files.map(file => file.path)) : [];
      
      // Create new Personal Data Sheet
      const newSaln = new Saln({
        salFirstName,
        salLastName,
        salMiddleName,
        salSuffix,
        salScannedPicture, // Save the file path to the database
      });

      // Save the new Personal Data Sheet to the database
      await newSaln.save();

      // Respond with success message
      res.status(201).json({
        status: "success",
        message: "SALN added successfully",
        data: {
          saln: newSaln,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};

// Controller to get all PDS
exports.getAllSaln = async (req, res, next) => {
  try {
    const saln = await Saln.find();

    const dataWithImageUrls = saln.map((sal) => {
      const imageUrl = sal.salScannedPicture.map((filePath) => {
        // Replace backslashes with forward slashes
        const normalizedPath = filePath.replace(/\\/g, '/');
        return `${req.protocol}://${req.get('host')}/${normalizedPath}`;
      });

      return {
        _id: sal._id,
        salLastName: sal.salLastName,
        salFirstName: sal.salFirstName,
        salMiddleName: sal.salMiddleName,
        salSuffix: sal.salSuffix,
        salScannedPicture: imageUrl, // Provide the image URLs for the frontend
        createdAt: sal.createdAt,
        updatedAt: sal.updatedAt,
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
exports.getSalnById = async (req, res, next) => {
  try {
    const saln = await Saln.findById(req.params.id);

    if (!saln) {
      return next(new createError("SALN not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        saln,
      },
    });
  } catch (error) {
    next(error);
  }
};


exports.updateSalnById = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new createError(err, 400));
    }

    try {
      // Fetch the existing Personal Data Sheet by ID
      const existingSaln = await Saln.findById(req.params.id);
      
      if (!existingSaln) {
        return next(new createError("SALN not found", 404));
      }

      // Get paths of uploaded files and convert backslashes to forward slashes
      const newSalScannedPictures = req.files.map(file => file.path.replace(/\\/g, '/'));

      // Combine the old and new image paths
      const combinedSalScannedPictures = [
        ...existingSaln.salScannedPicture,
        ...newSalScannedPictures,
      ];

      // Update the Personal Data Sheet with the new data and combined file paths
      const { salFirstName, salLastName, salMiddleName, salSuffix } = req.body;
      const updatedSaln = await Saln.findByIdAndUpdate(
        req.params.id,
        {
          salFirstName,
          salLastName,
          salMiddleName,
          salSuffix,
          salScannedPicture: combinedSalScannedPictures,
        },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        status: "success",
        message: "SALN updated successfully",
        data: {
          _id: updatedSaln._id,
          salLastName: updatedSaln.salLastName,
          salFirstName: updatedSaln.salFirstName,
          salMiddleName: updatedSaln.salMiddleName,
          salSuffix: updatedSaln.salSuffix,
          salScannedPicture: updatedSaln.salScannedPicture,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};


// Controller to delete PDS by ID
exports.deleteSalnById = async (req, res, next) => {
  try {
    const deletedSaln = await Saln.findByIdAndDelete(req.params.id);

    if (!deletedSaln) {
      return next(new createError("SALN not found", 404));
    }

    // Delete the picture files from the filesystem
    deletedSaln.salScannedPicture.forEach(picturePath => {
      const fullPath = path.join(__dirname, '..', picturePath);
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error("Failed to delete SALN:", err);
        }
      });
    });

    res.status(200).json({
      status: "success",
      message: "SALN deleted successfully",
      data: {
        _id: deletedSaln._id,
        salLastName: deletedSaln.salLastName,
        salFirstName: deletedSaln.salFirstName,
        salSuffix: deletedSaln.salSuffix,
        salScannedPicture: deletedSaln.salScannedPicture,
      },
    });
  } catch (error) {
    next(error);
  }
};



