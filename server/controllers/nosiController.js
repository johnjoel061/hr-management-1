const Nosi = require("../models/nosiModel");
const createError = require("../utils/appError");
const upload = require("../utils/nosiMulterConfig");
const fs = require('fs');
const path = require('path');

// Normalize file paths to use forward slashes
function normalizeFilePaths(filePaths) {
  return filePaths.map(filePath => filePath.replace(/\\/g, '/'));
}

exports.addNosi = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new createError(err, 400));
    }

    try {
      const { nosFirstName, nosLastName, nosMiddleName, nosSuffix } = req.body;

       // Get and normalize paths of uploaded files
       const nosScannedPicture = req.files ? normalizeFilePaths(req.files.map(file => file.path)) : [];
      
      // Create new Personal Data Sheet
      const newNosi = new Nosi({
        nosFirstName,
        nosLastName,
        nosMiddleName,
        nosSuffix,
        nosScannedPicture, // Save the file path to the database
      });

      // Save the new Personal Data Sheet to the database
      await newNosi.save();

      // Respond with success message
      res.status(201).json({
        status: "success",
        message: "NOSI added successfully",
        data: {
          nosi: newNosi,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};

// Controller to get all PDS
exports.getAllNosi = async (req, res, next) => {
  try {
    const nosi = await Nosi.find();

    const dataWithImageUrls = nosi.map((nos) => {
      const imageUrl = nos.nosScannedPicture.map((filePath) => {
        // Replace backslashes with forward slashes
        const normalizedPath = filePath.replace(/\\/g, '/');
        return `${req.protocol}://${req.get('host')}/${normalizedPath}`;
      });

      return {
        _id: nos._id,
        nosLastName: nos.nosLastName,
        nosFirstName: nos.nosFirstName,
        nosMiddleName: nos.nosMiddleName,
        nosSuffix: nos.nosSuffix,
        nosScannedPicture: imageUrl, // Provide the image URLs for the frontend
        createdAt: nos.createdAt,
        updatedAt: nos.updatedAt,
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
exports.getNosiById = async (req, res, next) => {
  try {
    const nosi = await Nosi.findById(req.params.id);

    if (!nosi) {
      return next(new createError("NOSI not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        nosi,
      },
    });
  } catch (error) {
    next(error);
  }
};


exports.updateNosiById = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new createError(err, 400));
    }

    try {
      // Fetch the existing Personal Data Sheet by ID
      const existingNosi = await Nosi.findById(req.params.id);
      
      if (!existingNosi) {
        return next(new createError("NOSI not found", 404));
      }

      // Get paths of uploaded files and convert backslashes to forward slashes
      const newNosScannedPictures = req.files.map(file => file.path.replace(/\\/g, '/'));

      // Combine the old and new image paths
      const combinedNosScannedPictures = [
        ...existingNosi.nosScannedPicture,
        ...newNosScannedPictures,
      ];

      // Update the Personal Data Sheet with the new data and combined file paths
      const { nosFirstName, nosLastName, nosMiddleName, nosSuffix } = req.body;
      const updatedNosi = await Nosi.findByIdAndUpdate(
        req.params.id,
        {
          nosFirstName,
          nosLastName,
          nosMiddleName,
          nosSuffix,
          nosScannedPicture: combinedNosScannedPictures,
        },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        status: "success",
        message: "NOSI updated successfully",
        data: {
          _id: updatedNosi._id,
          nosLastName: updatedNosi.nosLastName,
          nosFirstName: updatedNosi.nosFirstName,
          nosMiddleName: updatedNosi.nosMiddleName,
          nosSuffix: updatedNosi.nosSuffix,
          nosScannedPicture: updatedNosi.nosScannedPicture,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};


// Controller to delete PDS by ID
exports.deleteNosiById = async (req, res, next) => {
  try {
    const deletedNosi = await Nosi.findByIdAndDelete(req.params.id);

    if (!deletedNosi) {
      return next(new createError("NOSI not found", 404));
    }

    // Delete the picture files from the filesystem
    deletedNosi.nosScannedPicture.forEach(picturePath => {
      const fullPath = path.join(__dirname, '..', picturePath);
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error("Failed to delete NOSI:", err);
        }
      });
    });

    res.status(200).json({
      status: "success",
      message: "NOSI deleted successfully",
      data: {
        _id: deletedNosi._id,
        nosLastName: deletedNosi.nosLastName,
        nosFirstName: deletedNosi.nosFirstName,
        nosSuffix: deletedNosi.nosSuffix,
        nosScannedPicture: deletedNosi.nosScannedPicture,
      },
    });
  } catch (error) {
    next(error);
  }
};



