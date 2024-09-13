const Cos = require("../models/cosModel");
const createError = require("../utils/appError");
const upload = require("../utils/contractOfServiceMulterConfig");
const fs = require('fs');
const path = require('path');

// Normalize file paths to use forward slashes
function normalizeFilePaths(filePaths) {
  return filePaths.map(filePath => filePath.replace(/\\/g, '/'));
}

exports.addCos = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new createError(err, 400));
    }

    try {
      const { cosFirstName, cosLastName, cosMiddleName, cosSuffix } = req.body;

       // Get and normalize paths of uploaded files
       const cosScannedPicture = req.files ? normalizeFilePaths(req.files.map(file => file.path)) : [];
      
      // Create new Personal Data Sheet
      const newCos = new Cos({
        cosFirstName,
        cosLastName,
        cosMiddleName,
        cosSuffix,
        cosScannedPicture, // Save the file path to the database
      });

      // Save the new Personal Data Sheet to the database
      await newCos.save();

      // Respond with success message
      res.status(201).json({
        status: "success",
        message: "COS added successfully",
        data: {
          cos: newCos,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};

// Controller to get all PDS
exports.getAllCos = async (req, res, next) => {
  try {
    const cos = await Cos.find();

    const dataWithImageUrls = cos.map((cs) => {
      const imageUrl = cs.cosScannedPicture.map((filePath) => {
        // Replace backslashes with forward slashes
        const normalizedPath = filePath.replace(/\\/g, '/');
        return `${req.protocol}://${req.get('host')}/${normalizedPath}`;
      });

      return {
        _id: cs._id,
        cosLastName: cs.cosLastName,
        cosFirstName: cs.cosFirstName,
        cosMiddleName: cs.cosMiddleName,
        cosSuffix: cs.cosSuffix,
        cosScannedPicture: imageUrl, // Provide the image URLs for the frontend
        createdAt: cs.createdAt,
        updatedAt: cs.updatedAt,
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
exports.getCosById = async (req, res, next) => {
  try {
    const cos = await Cos.findById(req.params.id);

    if (!cos) {
      return next(new createError("COS not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        cos,
      },
    });
  } catch (error) {
    next(error);
  }
};


exports.updateCosById = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new createError(err, 400));
    }

    try {
      // Fetch the existing Personal Data Sheet by ID
      const existingCos = await Cos.findById(req.params.id);
      
      if (!existingCos) {
        return next(new createError("COS not found", 404));
      }

      // Get paths of uploaded files and convert backslashes to forward slashes
      const newCosScannedPictures = req.files.map(file => file.path.replace(/\\/g, '/'));

      // Combine the old and new image paths
      const combinedCosScannedPictures = [
        ...existingCos.cosScannedPicture,
        ...newCosScannedPictures,
      ];

      // Update the Personal Data Sheet with the new data and combined file paths
      const { cosFirstName, cosLastName, cosMiddleName, cosSuffix } = req.body;
      const updatedCos = await Cos.findByIdAndUpdate(
        req.params.id,
        {
          cosFirstName,
          cosLastName,
          cosMiddleName,
          cosSuffix,
          cosScannedPicture: combinedCosScannedPictures,
        },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        status: "success",
        message: "COS updated successfully",
        data: {
          _id: updatedCos._id,
          cosLastName: updatedCos.cosLastName,
          cosFirstName: updatedCos.cosFirstName,
          cosMiddleName: updatedCos.cosMiddleName,
          cosSuffix: updatedCos.cosSuffix,
          cosScannedPicture: updatedCos.cosScannedPicture,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};


// Controller to delete PDS by ID
exports.deleteCosById = async (req, res, next) => {
  try {
    const deletedCos = await Cos.findByIdAndDelete(req.params.id);

    if (!deletedCos) {
      return next(new createError("COS not found", 404));
    }

    // Delete the picture files from the filesystem
    deletedCos.cosScannedPicture.forEach(picturePath => {
      const fullPath = path.join(__dirname, '..', picturePath);
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error("Failed to delete COS:", err);
        }
      });
    });

    res.status(200).json({
      status: "success",
      message: "COS deleted successfully",
      data: {
        _id: deletedCos._id,
        cosLastName: deletedCos.cosLastName,
        cosFirstName: deletedCos.cosFirstName,
        cosSuffix: deletedCos.cosSuffix,
        cosScannedPicture: deletedCos.cosScannedPicture,
      },
    });
  } catch (error) {
    next(error);
  }
};



