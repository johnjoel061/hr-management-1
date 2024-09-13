const Appointment = require("../models/appointmentModel");
const createError = require("../utils/appError");
const upload = require("../utils/appointmentMulterConfig");
const fs = require('fs');
const path = require('path');

// Normalize file paths to use forward slashes
function normalizeFilePaths(filePaths) {
  return filePaths.map(filePath => filePath.replace(/\\/g, '/'));
}

exports.addAppointment = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new createError(err, 400));
    }

    try {
      const { appFirstName, appLastName, appMiddleName, appSuffix } = req.body;

       // Get and normalize paths of uploaded files
       const appScannedPicture = req.files ? normalizeFilePaths(req.files.map(file => file.path)) : [];
      
      // Create new Personal Data Sheet
      const newAppointment = new Appointment({
        appFirstName,
        appLastName,
        appMiddleName,
        appSuffix,
        appScannedPicture, // Save the file path to the database
      });

      // Save the new Personal Data Sheet to the database
      await newAppointment.save();

      // Respond with success message
      res.status(201).json({
        status: "success",
        message: "Appointment added successfully",
        data: {
          appointment: newAppointment,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};

// Controller to get all PDS
exports.getAllAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.find();

    const dataWithImageUrls = appointment.map((app) => {
      const imageUrl = app.appScannedPicture.map((filePath) => {
        // Replace backslashes with forward slashes
        const normalizedPath = filePath.replace(/\\/g, '/');
        return `${req.protocol}://${req.get('host')}/${normalizedPath}`;
      });

      return {
        _id: app._id,
        appLastName: app.appLastName,
        appFirstName: app.appFirstName,
        appMiddleName: app.appMiddleName,
        appSuffix: app.appSuffix,
        appScannedPicture: imageUrl, // Provide the image URLs for the frontend
        createdAt: app.createdAt,
        updatedAt: app.updatedAt,
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
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return next(new createError("Appointment not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        appointment,
      },
    });
  } catch (error) {
    next(error);
  }
};


exports.updateAppointmentById = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new createError(err, 400));
    }

    try {
      // Fetch the existing Personal Data Sheet by ID
      const existingAppointment = await Appointment.findById(req.params.id);
      
      if (!existingAppointment) {
        return next(new createError("Appointment not found", 404));
      }

      // Get paths of uploaded files and convert backslashes to forward slashes
      const newAppScannedPictures = req.files.map(file => file.path.replace(/\\/g, '/'));

      // Combine the old and new image paths
      const combinedPdsScannedPictures = [
        ...existingAppointment.appScannedPicture,
        ...newAppScannedPictures,
      ];

      // Update the Personal Data Sheet with the new data and combined file paths
      const { appFirstName, appLastName, appMiddleName, appSuffix } = req.body;
      const updatedAppointment = await Appointment.findByIdAndUpdate(
        req.params.id,
        {
          appFirstName,
          appLastName,
          appMiddleName,
          appSuffix,
          appScannedPicture: combinedPdsScannedPictures,
        },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        status: "success",
        message: "Appointment updated successfully",
        data: {
          _id: updatedAppointment._id,
          appLastName: updatedAppointment.appLastName,
          appFirstName: updatedAppointment.appFirstName,
          appMiddleName: updatedAppointment.appMiddleName,
          appSuffix: updatedAppointment.appSuffix,
          appScannedPicture: updatedAppointment.appScannedPicture,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};


// Controller to delete PDS by ID
exports.deleteAppointmentById = async (req, res, next) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!deletedAppointment) {
      return next(new createError("Appointment not found", 404));
    }

    // Delete the picture files from the filesystem
    deletedAppointment.appScannedPicture.forEach(picturePath => {
      const fullPath = path.join(__dirname, '..', picturePath);
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error("Failed to delete appointment:", err);
        }
      });
    });

    res.status(200).json({
      status: "success",
      message: "Appointment deleted successfully",
      data: {
        _id: deletedAppointment._id,
        appLastName: deletedAppointment.appLastName,
        appFirstName: deletedAppointment.appFirstName,
        appSuffix: deletedAppointment.appSuffix,
        appScannedPicture: deletedAppointment.appScannedPicture,
      },
    });
  } catch (error) {
    next(error);
  }
};



