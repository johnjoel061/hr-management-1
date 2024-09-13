const OrgStructure = require("../models/orgStructureModel");
const createError = require("../utils/appError");
const upload = require("../utils/orgStructureMulterConfig");
const fs = require('fs');
const path = require('path');

// Normalize file paths to use forward slashes
function normalizeFilePaths(filePaths) {
  return filePaths.map(filePath => filePath.replace(/\\/g, '/'));
}

exports.addOrgStructure = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new createError(err, 400));
    }

    try {
      const { orgTitle } = req.body;

       // Get and normalize paths of uploaded files
       const orgScannedPicture = req.files ? normalizeFilePaths(req.files.map(file => file.path)) : [];
      
      // Create new Personal Data Sheet
      const newOrgStructure = new OrgStructure({
        orgTitle,
        orgScannedPicture, // Save the file path to the database
      });

      // Save the new Personal Data Sheet to the database
      await newOrgStructure.save();

      // Respond with success message
      res.status(201).json({
        status: "success",
        message: "Organizational Structure added successfully",
        data: {
          orgStructure: newOrgStructure,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};

// Controller to get all PDS
exports.getAllOrgStructure = async (req, res, next) => {
  try {
    const orgStructure = await OrgStructure.find();

    const dataWithImageUrls = orgStructure.map((org) => {
      const imageUrl = org.orgScannedPicture.map((filePath) => {
        // Replace backslashes with forward slashes
        const normalizedPath = filePath.replace(/\\/g, '/');
        return `${req.protocol}://${req.get('host')}/${normalizedPath}`;
      });

      return {
        _id: org._id,
        orgTitle: org.orgTitle,
        orgScannedPicture: imageUrl, // Provide the image URLs for the frontend
        createdAt: org.createdAt,
        updatedAt: org.updatedAt,
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
exports.getOrgStructureById = async (req, res, next) => {
  try {
    const orgStructure = await OrgStructure.findById(req.params.id);

    if (!orgStructure) {
      return next(new createError("Organizational Structure not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        orgStructure,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateOrgStructureById = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new createError(err, 400));
    }

    try {
      // Fetch the existing Personal Data Sheet by ID
      const existingOrgStructure = await OrgStructure.findById(req.params.id);
      
      if (!existingOrgStructure) {
        return next(new createError("Organizational Structure not found", 404));
      }

      // Get paths of uploaded files and convert backslashes to forward slashes
      const newOrgScannedPictures = req.files.map(file => file.path.replace(/\\/g, '/'));

      // Combine the old and new image paths
      const combinedOrgScannedPictures = [
        ...existingOrgStructure.orgScannedPicture,
        ...newOrgScannedPictures,
      ];

      // Update the Personal Data Sheet with the new data and combined file paths
      const { orgTitle } = req.body;
      const updatedOrgStructure = await OrgStructure.findByIdAndUpdate(
        req.params.id,
        {
          orgTitle,
          orgScannedPicture: combinedOrgScannedPictures,
        },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        status: "success",
        message: "Organizational Structure updated successfully",
        data: {
          _id: updatedOrgStructure._id,
          orgTitle: updatedOrgStructure.orgTitle,
          orgScannedPicture: updatedOrgStructure.orgScannedPicture,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};


// Controller to delete PDS by ID
exports.deleteOrgStructureById = async (req, res, next) => {
  try {
    const deletedOrgStructure = await OrgStructure.findByIdAndDelete(req.params.id);

    if (!deletedOrgStructure) {
      return next(new createError("Organizational Structure not found", 404));
    }

    // Delete the picture files from the filesystem
    deletedOrgStructure.orgScannedPicture.forEach(picturePath => {
      const fullPath = path.join(__dirname, '..', picturePath);
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error("Failed to delete Organizational Structure:", err);
        }
      });
    });

    res.status(200).json({
      status: "success",
      message: "Organizational Structure deleted successfully",
      data: {
        _id: deletedOrgStructure._id,
        appSuffix: deletedOrgStructure.appSuffix,
        orgScannedPicture: deletedOrgStructure.orgScannedPicture,
      },
    });
  } catch (error) {
    next(error);
  }
};



