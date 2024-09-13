const MedicalCertificate = require("../models/medicalCertificateModel");
const createError = require("../utils/appError");
const upload = require("../utils/medicalCertificateMulterConfig");
const fs = require('fs');
const path = require('path');

// Normalize file paths to use forward slashes
function normalizeFilePaths(filePaths) {
  return filePaths.map(filePath => filePath.replace(/\\/g, '/'));
}

exports.addMedicalCertificate = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new createError(err, 400));
    }

    try {
      const { medFirstName, medLastName, medMiddleName, medSuffix } = req.body;

       // Get and normalize paths of uploaded files
       const medScannedPicture = req.files ? normalizeFilePaths(req.files.map(file => file.path)) : [];
      
      // Create new Personal Data Sheet
      const newMedicalCertificate = new MedicalCertificate({
        medFirstName,
        medLastName,
        medMiddleName,
        medSuffix,
        medScannedPicture, // Save the file path to the database
      });

      // Save the new Personal Data Sheet to the database
      await newMedicalCertificate.save();

      // Respond with success message
      res.status(201).json({
        status: "success",
        message: "Medical Certificate added successfully",
        data: {
          medicalCertificate: newMedicalCertificate,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};

// Controller to get all PDS
exports.getAllMedicalCertificate = async (req, res, next) => {
  try {
    const medicalCertificate = await MedicalCertificate.find();

    const dataWithImageUrls = medicalCertificate.map((med) => {
      const imageUrl = med.medScannedPicture.map((filePath) => {
        // Replace backslashes with forward slashes
        const normalizedPath = filePath.replace(/\\/g, '/');
        return `${req.protocol}://${req.get('host')}/${normalizedPath}`;
      });

      return {
        _id: med._id,
        medLastName: med.medLastName,
        medFirstName: med.medFirstName,
        medMiddleName: med.medMiddleName,
        medSuffix: med.medSuffix,
        medScannedPicture: imageUrl, // Provide the image URLs for the frontend
        createdAt: med.createdAt,
        updatedAt: med.updatedAt,
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
exports.getAppointmentById = async (req, res, next) => {
  try {
    const medicalCertificate = await MedicalCertificate.findById(req.params.id);

    if (!medicalCertificate) {
      return next(new createError("Medical Certificate not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        medicalCertificate,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateMedicalCertificateById = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new createError(err, 400));
    }

    try {
      // Fetch the existing Personal Data Sheet by ID
      const existingMedicalCertificate = await MedicalCertificate.findById(req.params.id);
      
      if (!existingMedicalCertificate) {
        return next(new createError("Medical Certificate not found", 404));
      }

      // Get paths of uploaded files and convert backslashes to forward slashes
      const newMedScannedPictures = req.files.map(file => file.path.replace(/\\/g, '/'));

      // Combine the old and new image paths
      const combinedMedScannedPictures = [
        ...existingMedicalCertificate.medScannedPicture,
        ...newMedScannedPictures,
      ];

      // Update the Personal Data Sheet with the new data and combined file paths
      const { medFirstName, medLastName, medMiddleName, medSuffix } = req.body;
      const updatedMedicalCertificate = await MedicalCertificate.findByIdAndUpdate(
        req.params.id,
        {
          medFirstName,
          medLastName,
          medMiddleName,
          medSuffix,
          medScannedPicture: combinedMedScannedPictures,
        },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        status: "success",
        message: "Medical Certificate updated successfully",
        data: {
          _id: updatedMedicalCertificate._id,
          medLastName: updatedMedicalCertificate.medLastName,
          medFirstName: updatedMedicalCertificate.medFirstName,
          medMiddleName: updatedMedicalCertificate.medMiddleName,
          medSuffix: updatedMedicalCertificate.medSuffix,
          medScannedPicture: updatedMedicalCertificate.medScannedPicture,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};


// Controller to delete PDS by ID
exports.deleteMedicalCertificateById = async (req, res, next) => {
  try {
    const deletedMedicalCertificate = await MedicalCertificate.findByIdAndDelete(req.params.id);

    if (!deletedMedicalCertificate) {
      return next(new createError("Medical Certificate not found", 404));
    }

    // Delete the picture files from the filesystem
    deletedMedicalCertificate.medScannedPicture.forEach(picturePath => {
      const fullPath = path.join(__dirname, '..', picturePath);
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error("Failed to delete Medical Certificate:", err);
        }
      });
    });

    res.status(200).json({
      status: "success",
      message: "Medical Certificate deleted successfully",
      data: {
        _id: deletedMedicalCertificate._id,
        medLastName: deletedMedicalCertificate.medLastName,
        medFirstName: deletedMedicalCertificate.medFirstName,
        medSuffix: deletedMedicalCertificate.medSuffix,
        medScannedPicture: deletedMedicalCertificate.medScannedPicture,
      },
    });
  } catch (error) {
    next(error);
  }
};



