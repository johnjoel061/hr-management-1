const PersonalDataSheet = require("../models/personalDataSheetModel");
const createError = require("../utils/appError");
const upload = require("../utils/pdsMulterConfig");
const fs = require('fs');
const path = require('path');

// Normalize file paths to use forward slashes
function normalizeFilePaths(filePaths) {
  return filePaths.map(filePath => filePath.replace(/\\/g, '/'));
}

exports.addPersonalDataSheet = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new createError(err, 400));
    }

    try {
      const { pdsFirstName, pdsLastName, pdsMiddleName, pdsSuffix } = req.body;

      // Check if a Personal Data Sheet with the same first name, last name, and suffix already exists
      // const existingPersonalDataSheet = await PersonalDataSheet.findOne({
      //   pdsFirstName,
      //   pdsLastName,
      //   pdsMiddleName,
      //   pdsSuffix,
      //   pdsScannedPicture,
      // });

      // if (existingPersonalDataSheet) {
      //   return next(new createError("Personal Data Sheet (PDS) already exists!", 400));
      // }


       // Get and normalize paths of uploaded files
       const pdsScannedPicture = req.files ? normalizeFilePaths(req.files.map(file => file.path)) : [];
      
      // Create new Personal Data Sheet
      const newPersonalDataSheet = new PersonalDataSheet({
        pdsFirstName,
        pdsLastName,
        pdsMiddleName,
        pdsSuffix,
        pdsScannedPicture, // Save the file path to the database
      });

      // Save the new Personal Data Sheet to the database
      await newPersonalDataSheet.save();

      // Respond with success message
      res.status(201).json({
        status: "success",
        message: "Personal Data Sheet (PDS) added successfully",
        data: {
          personalDataSheet: newPersonalDataSheet,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};

// Controller to get all PDS
exports.getAllPersonalDataSheet = async (req, res, next) => {
  try {
    const personalDataSheet = await PersonalDataSheet.find();

    const dataWithImageUrls = personalDataSheet.map((pds) => {
      const imageUrl = pds.pdsScannedPicture.map((filePath) => {
        // Replace backslashes with forward slashes
        const normalizedPath = filePath.replace(/\\/g, '/');
        return `${req.protocol}://${req.get('host')}/${normalizedPath}`;
      });

      return {
        _id: pds._id,
        pdsLastName: pds.pdsLastName,
        pdsFirstName: pds.pdsFirstName,
        pdsMiddleName: pds.pdsMiddleName,
        pdsSuffix: pds.pdsSuffix,
        pdsScannedPicture: imageUrl, // Provide the image URLs for the frontend
        createdAt: pds.createdAt,
        updatedAt: pds.updatedAt,
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
exports.getPersonalDataSheetById = async (req, res, next) => {
  try {
    const personalDataSheet = await PersonalDataSheet.findById(req.params.id);

    if (!personalDataSheet) {
      return next(new createError("Personal Data Sheet (PDS) not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        personalDataSheet,
      },
    });
  } catch (error) {
    next(error);
  }
};


exports.updatePersonalDataSheetById = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new createError(err, 400));
    }

    try {
      // Fetch the existing Personal Data Sheet by ID
      const existingPersonalDataSheet = await PersonalDataSheet.findById(req.params.id);
      
      if (!existingPersonalDataSheet) {
        return next(new createError("Personal Data Sheet (PDS) not found", 404));
      }

      // Get paths of uploaded files and convert backslashes to forward slashes
      const newPdsScannedPictures = req.files.map(file => file.path.replace(/\\/g, '/'));

      // Combine the old and new image paths
      const combinedPdsScannedPictures = [
        ...existingPersonalDataSheet.pdsScannedPicture,
        ...newPdsScannedPictures,
      ];

      // Update the Personal Data Sheet with the new data and combined file paths
      const { pdsFirstName, pdsLastName, pdsMiddleName, pdsSuffix } = req.body;
      const updatedPersonalDataSheet = await PersonalDataSheet.findByIdAndUpdate(
        req.params.id,
        {
          pdsFirstName,
          pdsLastName,
          pdsMiddleName,
          pdsSuffix,
          pdsScannedPicture: combinedPdsScannedPictures,
        },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        status: "success",
        message: "Personal Data Sheet (PDS) updated successfully",
        data: {
          _id: updatedPersonalDataSheet._id,
          pdsLastName: updatedPersonalDataSheet.pdsLastName,
          pdsFirstName: updatedPersonalDataSheet.pdsFirstName,
          pdsMiddleName: updatedPersonalDataSheet.pdsMiddleName,
          pdsSuffix: updatedPersonalDataSheet.pdsSuffix,
          pdsScannedPicture: updatedPersonalDataSheet.pdsScannedPicture,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};


// Controller to delete PDS by ID
exports.deletePersonalDataSheetById = async (req, res, next) => {
  try {
    const deletedPersonalDataSheet = await PersonalDataSheet.findByIdAndDelete(req.params.id);

    if (!deletedPersonalDataSheet) {
      return next(new createError("Personal Data Sheet (PDS) not found", 404));
    }

    // Delete the picture files from the filesystem
    deletedPersonalDataSheet.pdsScannedPicture.forEach(picturePath => {
      const fullPath = path.join(__dirname, '..', picturePath);
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error("Failed to delete picture file:", err);
        }
      });
    });

    res.status(200).json({
      status: "success",
      message: "Personal Data Sheet (PDS) deleted successfully",
      data: {
        _id: deletedPersonalDataSheet._id,
        pdsLastName: deletedPersonalDataSheet.pdsLastName,
        pdsFirstName: deletedPersonalDataSheet.pdsFirstName,
        pdsSuffix: deletedPersonalDataSheet.pdsSuffix,
        pdsScannedPicture: deletedPersonalDataSheet.pdsScannedPicture,
      },
    });
  } catch (error) {
    next(error);
  }
};



