const CertificateOfEligibility = require("../models/certificateOfEligibilityModel");
const createError = require("../utils/appError");
const upload = require("../utils/certificateOfEligibilityMulterConfig");
const fs = require('fs');
const path = require('path');

// Normalize file paths to use forward slashes
function normalizeFilePaths(filePaths) {
  return filePaths.map(filePath => filePath.replace(/\\/g, '/'));
}

exports.addCertificateOfEligibility = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new createError(err, 400));
    }

    try {
      const { cerFirstName, cerLastName, cerMiddleName, cerSuffix } = req.body;

       // Get and normalize paths of uploaded files
       const cerScannedPicture = req.files ? normalizeFilePaths(req.files.map(file => file.path)) : [];
      
      // Create new Personal Data Sheet
      const newCertificateOfEligibility = new CertificateOfEligibility({
        cerFirstName,
        cerLastName,
        cerMiddleName,
        cerSuffix,
        cerScannedPicture, // Save the file path to the database
      });

      // Save the new Personal Data Sheet to the database
      await newCertificateOfEligibility.save();

      // Respond with success message
      res.status(201).json({
        status: "success",
        message: "Certificate Of Eligibility added successfully",
        data: {
            certificateOfEligibility: newCertificateOfEligibility,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};

// Controller to get all PDS
exports.getAllCertificateOfEligibility = async (req, res, next) => {
  try {
    const certificateOfEligibility = await CertificateOfEligibility.find();

    const dataWithImageUrls = certificateOfEligibility.map((cer) => {
      const imageUrl = cer.cerScannedPicture.map((filePath) => {
        // Replace backslashes with forward slashes
        const normalizedPath = filePath.replace(/\\/g, '/');
        return `${req.protocol}://${req.get('host')}/${normalizedPath}`;
      });

      return {
        _id: cer._id,
        cerLastName: cer.cerLastName,
        cerFirstName: cer.cerFirstName,
        cerMiddleName: cer.cerMiddleName,
        cerSuffix: cer.cerSuffix,
        cerScannedPicture: imageUrl, // Provide the image URLs for the frontend
        createdAt: cer.createdAt,
        updatedAt: cer.updatedAt,
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
exports.getCertificateOfEligibilityById = async (req, res, next) => {
  try {
    const certificateOfEligibility = await CertificateOfEligibility.findById(req.params.id);

    if (!certificateOfEligibility) {
      return next(new createError("Certificate Of Eligibility not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        certificateOfEligibility,
      },
    });
  } catch (error) {
    next(error);
  }
};


exports.updateCertificateOfEligibilityById = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new createError(err, 400));
    }

    try {
      // Fetch the existing Personal Data Sheet by ID
      const existingCertificateOfEligibility = await CertificateOfEligibility.findById(req.params.id);
      
      if (!existingCertificateOfEligibility) {
        return next(new createError("Certificate Of Eligibility not found", 404));
      }

      // Get paths of uploaded files and convert backslashes to forward slashes
      const newCerScannedPictures = req.files.map(file => file.path.replace(/\\/g, '/'));

      // Combine the old and new image paths
      const combinedCerScannedPictures = [
        ...existingCertificateOfEligibility.cerScannedPicture,
        ...newCerScannedPictures,
      ];

      // Update the Personal Data Sheet with the new data and combined file paths
      const { cerFirstName, cerLastName, cerMiddleName, cerSuffix } = req.body;
      const updatedCertificateOfEligibility = await CertificateOfEligibility.findByIdAndUpdate(
        req.params.id,
        {
          cerFirstName,
          cerLastName,
          cerMiddleName,
          cerSuffix,
          cerScannedPicture: combinedCerScannedPictures,
        },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        status: "success",
        message: "Certificate Of Eligibility updated successfully",
        data: {
          _id: updatedCertificateOfEligibility._id,
          cerLastName: updatedCertificateOfEligibility.cerLastName,
          cerFirstName: updatedCertificateOfEligibility.cerFirstName,
          cerMiddleName: updatedCertificateOfEligibility.cerMiddleName,
          cerSuffix: updatedCertificateOfEligibility.cerSuffix,
          cerScannedPicture: updatedCertificateOfEligibility.cerScannedPicture,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};


// Controller to delete PDS by ID
exports.deleteCertificateOfEligibilityById = async (req, res, next) => {
  try {
    const deletedCertificateOfEligibility = await CertificateOfEligibility.findByIdAndDelete(req.params.id);

    if (!deletedCertificateOfEligibility) {
      return next(new createError("Certificate Of Eligibility not found", 404));
    }

    // Delete the picture files from the filesystem
    deletedCertificateOfEligibility.cerScannedPicture.forEach(picturePath => {
      const fullPath = path.join(__dirname, '..', picturePath);
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error("Failed to delete Certificate Of Eligibility:", err);
        }
      });
    });

    res.status(200).json({
      status: "success",
      message: "Certificate Of Eligibility deleted successfully",
      data: {
        _id: deletedCertificateOfEligibility._id,
        cerLastName: deletedCertificateOfEligibility.cerLastName,
        cerFirstName: deletedCertificateOfEligibility.cerFirstName,
        cerSuffix: deletedCertificateOfEligibility.cerSuffix,
        cerScannedPicture: deletedCertificateOfEligibility.cerScannedPicture,
      },
    });
  } catch (error) {
    next(error);
  }
};



