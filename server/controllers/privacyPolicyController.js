const PrivacyPolicy = require("../models/privacyPolicyModel");
const createError = require("../utils/appError");

// Controller to add Privacy Policy
exports.addPrivacyPolicy = async (req, res, next) => {
  try {
    // Check if Privacy Policy already exists
    const existingPrivacyPolicy = await PrivacyPolicy.findOne({ privacyTitle: req.body.privacyTitle });

    if (existingPrivacyPolicy) {
      return next(createError(400, "Privacy Policy already exists!"));
    }

    // Create new Privacy Policy
    const newPrivacyPolicy = new PrivacyPolicy({
      privacyTitle: req.body.privacyTitle,
      privacyDescription: req.body.privacyDescription,
    });

    // Save the new Privacy Policy to the database
    await newPrivacyPolicy.save();

    // Respond with success message
    res.status(201).json({
      status: "success",
      message: "Privacy Policy added successfully",
      data: {
        _id: newPrivacyPolicy._id,
        privacyTitle: newPrivacyPolicy.privacyTitle,
        privacyDescription: newPrivacyPolicy.privacyDescription,
        createdAt: newPrivacyPolicy.createdAt,
        updatedAt: newPrivacyPolicy.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Controller to get all Privacy Policies
exports.getAllPrivacyPolicy = async (req, res, next) => {
  try {
    const privacyPolicy = await PrivacyPolicy.find();

    res.status(200).json({
      status: "success",
      results: privacyPolicy.length,
      data: privacyPolicy.map((privacy) => ({
        _id: privacy._id,
        privacyTitle: privacy.privacyTitle,
        privacyDescription: privacy.privacyDescription,
        createdAt: privacy.createdAt,
        updatedAt: privacy.updatedAt,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// Controller to get Privacy Policy by ID
exports.getPrivacyPolicyById = async (req, res, next) => {
  try {
    const privacyPolicy = await PrivacyPolicy.findById(req.params.id);

    if (!privacyPolicy) {
      return next(new createError("Privacy Policy not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        privacyPolicy,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Controller to update Privacy Policy by ID
exports.updatePrivacyPolicyById = async (req, res, next) => {
  try {
    const updatedPrivacyPolicy = await PrivacyPolicy.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedPrivacyPolicy) {
      return next(new createError("Privacy Policy not found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Privacy Policy updated successfully",
      data: {
        privacyPolicy: updatedPrivacyPolicy,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Controller to delete Privacy Policy by ID
exports.deletePrivacyPolicyById = async (req, res, next) => {
  try {
    const deletedPrivacyPolicy = await PrivacyPolicy.findByIdAndDelete(req.params.id);

    if (!deletedPrivacyPolicy) {
      return next(new createError("Privacy Policy not found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Privacy Policy deleted successfully",
      data: {
        privacyPolicy: deletedPrivacyPolicy,
      },
    });
  } catch (error) {
    next(error);
  }
};
