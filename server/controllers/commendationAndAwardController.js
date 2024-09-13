const CommendationAndAward = require("../models/commendationAndAwardModel");
const createError = require("../utils/appError");
const upload = require("../utils/commendationsAndAwardsMulterConfig");
const fs = require('fs');
const path = require('path');

// Normalize file paths to use forward slashes
function normalizeFilePaths(filePaths) {
  return filePaths.map(filePath => filePath.replace(/\\/g, '/'));
}

exports.addCommendationAndAward = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new createError(err, 400));
    }

    try {
      const { comFirstName, comLastName, comMiddleName, comSuffix } = req.body;

       // Get and normalize paths of uploaded files
       const comScannedPicture = req.files ? normalizeFilePaths(req.files.map(file => file.path)) : [];
      
      // Create new Personal Data Sheet
      const newCommendationAndAward = new CommendationAndAward({
        comFirstName,
        comLastName,
        comMiddleName,
        comSuffix,
        comScannedPicture, // Save the file path to the database
      });

      // Save the new Personal Data Sheet to the database
      await newCommendationAndAward.save();

      // Respond with success message
      res.status(201).json({
        status: "success",
        message: "Commendation and Award added successfully",
        data: {
          commendationAndAward: newCommendationAndAward,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};

// Controller to get all PDS
exports.getAllCommendationAndAward = async (req, res, next) => {
  try {
    const commendationAndAward = await CommendationAndAward.find();

    const dataWithImageUrls = commendationAndAward.map((com) => {
      const imageUrl = com.comScannedPicture.map((filePath) => {
        // Replace backslashes with forward slashes
        const normalizedPath = filePath.replace(/\\/g, '/');
        return `${req.protocol}://${req.get('host')}/${normalizedPath}`;
      });

      return {
        _id: com._id,
        comLastName: com.comLastName,
        comFirstName: com.comFirstName,
        comMiddleName: com.comMiddleName,
        comSuffix: com.comSuffix,
        comScannedPicture: imageUrl, // Provide the image URLs for the frontend
        createdAt: com.createdAt,
        updatedAt: com.updatedAt,
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
exports.getCommendationAndAwardById = async (req, res, next) => {
  try {
    const commendationAndAward = await CommendationAndAward.findById(req.params.id);

    if (!commendationAndAward) {
      return next(new createError("Commendation and Award not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        commendationAndAward,
      },
    });
  } catch (error) {
    next(error);
  }
};


exports.updateCommendationAndAwardById = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new createError(err, 400));
    }

    try {
      // Fetch the existing Personal Data Sheet by ID
      const existingCommendationAndAward = await CommendationAndAward.findById(req.params.id);
      
      if (!existingCommendationAndAward) {
        return next(new createError("Commendation and Award not found", 404));
      }

      // Get paths of uploaded files and convert backslashes to forward slashes
      const newComScannedPictures = req.files.map(file => file.path.replace(/\\/g, '/'));

      // Combine the old and new image paths
      const combinedComScannedPictures = [
        ...existingCommendationAndAward.comScannedPicture,
        ...newComScannedPictures,
      ];

      // Update the Personal Data Sheet with the new data and combined file paths
      const { comFirstName, comLastName, comMiddleName, comSuffix } = req.body;
      const updatedCommendationAndAward = await CommendationAndAward.findByIdAndUpdate(
        req.params.id,
        {
          comFirstName,
          comLastName,
          comMiddleName,
          comSuffix,
          comScannedPicture: combinedComScannedPictures,
        },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        status: "success",
        message: "Commendation and Award updated successfully",
        data: {
          _id: updatedCommendationAndAward._id,
          comLastName: updatedCommendationAndAward.comLastName,
          comFirstName: updatedCommendationAndAward.comFirstName,
          comMiddleName: updatedCommendationAndAward.comMiddleName,
          comSuffix: updatedCommendationAndAward.comSuffix,
          comScannedPicture: updatedCommendationAndAward.comScannedPicture,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};


// Controller to delete PDS by ID
exports.deleteCommendationAndAwardById = async (req, res, next) => {
  try {
    const deletedCommendationAndAward = await CommendationAndAward.findByIdAndDelete(req.params.id);

    if (!deletedCommendationAndAward) {
      return next(new createError("Commendation and Award not found", 404));
    }

    // Delete the picture files from the filesystem
    deletedCommendationAndAward.comScannedPicture.forEach(picturePath => {
      const fullPath = path.join(__dirname, '..', picturePath);
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error("Failed to delete Commendation and Award:", err);
        }
      });
    });

    res.status(200).json({
      status: "success",
      message: "Commendation and Award deleted successfully",
      data: {
        _id: deletedCommendationAndAward._id,
        comLastName: deletedCommendationAndAward.comLastName,
        comFirstName: deletedCommendationAndAward.comFirstName,
        comSuffix: deletedCommendationAndAward.comSuffix,
        comScannedPicture: deletedCommendationAndAward.comScannedPicture,
      },
    });

  } catch (error) {
    next(error);
  }
};



