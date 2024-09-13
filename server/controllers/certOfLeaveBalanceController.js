const CertOfLeaveBalance = require("../models/certOfLeaveBalanceModel");
const createError = require("../utils/appError");
const upload = require("../utils/certOfLeaveBalanceMulterConfig");
const fs = require('fs');
const path = require('path');

// Normalize file paths to use forward slashes
function normalizeFilePaths(filePaths) {
  return filePaths.map(filePath => filePath.replace(/\\/g, '/'));
}

exports.addCertOfLeaveBalance = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new createError(err, 400));
    }

    try {
      const { cerFirstName, cerLastName, cerMiddleName, cerSuffix } = req.body;

       // Get and normalize paths of uploaded files
       const cerScannedPicture = req.files ? normalizeFilePaths(req.files.map(file => file.path)) : [];
      
      // Create new Personal Data Sheet
      const newCertOfLeaveBalance = new CertOfLeaveBalance({
        cerFirstName,
        cerLastName,
        cerMiddleName,
        cerSuffix,
        cerScannedPicture, // Save the file path to the database
      });

      // Save the new Personal Data Sheet to the database
      await newCertOfLeaveBalance.save();

      // Respond with success message
      res.status(201).json({
        status: "success",
        message: "Certificate of Leave Balance added successfully",
        data: {
            certOfLeaveBalance: newCertOfLeaveBalance,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};

// Controller to get all PDS
exports.getAllCertOfLeaveBalance = async (req, res, next) => {
  try {
    const certOfLeaveBalance = await CertOfLeaveBalance.find();

    const dataWithImageUrls = certOfLeaveBalance.map((cer) => {
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
exports.getCertOfLeaveBalanceById = async (req, res, next) => {
  try {
    const certOfLeaveBalance = await CertOfLeaveBalance.findById(req.params.id);

    if (!certOfLeaveBalance) {
      return next(new createError("Certificate of Leave Balance not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        certOfLeaveBalance,
      },
    });
  } catch (error) {
    next(error);
  }
};


exports.updateCertOfLeaveBalanceById = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new createError(err, 400));
    }

    try {
      // Fetch the existing Personal Data Sheet by ID
      const existingCertOfLeaveBalance = await CertOfLeaveBalance.findById(req.params.id);
      
      if (!existingCertOfLeaveBalance) {
        return next(new createError("Certificate of Leave Balance not found", 404));
      }

      // Get paths of uploaded files and convert backslashes to forward slashes
      const newCerScannedPictures = req.files.map(file => file.path.replace(/\\/g, '/'));

      // Combine the old and new image paths
      const combinedCerScannedPictures = [
        ...existingCertOfLeaveBalance.cerScannedPicture,
        ...newCerScannedPictures,
      ];

      // Update the Personal Data Sheet with the new data and combined file paths
      const { cerFirstName, cerLastName, cerMiddleName, cerSuffix } = req.body;
      const updatedCertOfLeaveBalance = await CertOfLeaveBalance.findByIdAndUpdate(
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
        message: "Certificate of Leave Balance updated successfully",
        data: {
          _id: updatedCertOfLeaveBalance._id,
          cerLastName: updatedCertOfLeaveBalance.cerLastName,
          cerFirstName: updatedCertOfLeaveBalance.cerFirstName,
          cerMiddleName: updatedCertOfLeaveBalance.cerMiddleName,
          cerSuffix: updatedCertOfLeaveBalance.cerSuffix,
          cerScannedPicture: updatedCertOfLeaveBalance.cerScannedPicture,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};


// Controller to delete PDS by ID
exports.deleteCertOfLeaveBalanceById = async (req, res, next) => {
  try {
    const deletedCertOfLeaveBalance = await CertOfLeaveBalance.findByIdAndDelete(req.params.id);

    if (!deletedCertOfLeaveBalance) {
      return next(new createError("Certificate of Leave Balance not found", 404));
    }

    // Delete the picture files from the filesystem
    deletedCertOfLeaveBalance.cerScannedPicture.forEach(picturePath => {
      const fullPath = path.join(__dirname, '..', picturePath);
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error("Failed to delete Certificate of Leave Balance:", err);
        }
      });
    });

    res.status(200).json({
      status: "success",
      message: "Certificate of Leave Balance deleted successfully",
      data: {
        _id: deletedCertOfLeaveBalance._id,
        cerLastName: deletedCertOfLeaveBalance.cerLastName,
        cerFirstName: deletedCertOfLeaveBalance.cerFirstName,
        cerSuffix: deletedCertOfLeaveBalance.cerSuffix,
        cerScannedPicture: deletedCertOfLeaveBalance.cerScannedPicture,
      },
    });
  } catch (error) {
    next(error);
  }
};



