const Eligibility = require("../models/eligibilityModel");
const createError = require("../utils/appError");

exports.addEligibility = async (req, res, next) => {
  try {
    // Check if eligibility already exists
    const existingEligibility = await Eligibility.findOne({
      eligibilityTitle: req.body.eligibilityTitle,
    });

    if (existingEligibility) {
      return next(new createError("Eligibility already exists!", 400));
    }

    // Create new eligibility
    const newEligibility = new Eligibility({
      eligibilityTitle: req.body.eligibilityTitle,
    });

    // Save the new eligibility to the database
    await newEligibility.save();

    // Respond with success message
    res.status(201).json({
      status: "success",
      message: "Eligibility added successfully",
      data: {
        eligibility: newEligibility,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Controller to get all eligibilities
exports.getAllEligibility = async (req, res, next) => {
  try {
    const eligibilities = await Eligibility.find();

    res.status(200).json({
      status: "success",
      results: eligibilities.length,
      data: eligibilities.map((eligibility) => ({
        _id: eligibility._id,
        eligibilityTitle: eligibility.eligibilityTitle,
        createdAt: eligibility.createdAt,
        updatedAt: eligibility.updatedAt,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// Controller to get eligibility by ID
exports.getEligibilityById = async (req, res, next) => {
  try {
    const eligibility = await Eligibility.findById(req.params.id);

    if (!eligibility) {
      return next(new createError("Eligibility not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        eligibility,
      },
    });
  } catch (error) {
    next(error);
  }
};


// Controller to update eligibility by ID
exports.updateEligibilityById = async (req, res, next) => {
  try {
    const updatedEligibility = await Eligibility.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedEligibility) {
      return next(new createError("Eligibility not found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Eligibility updated successfully",
      data: {
        eligibility: updatedEligibility,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Controller to delete eligibility by ID
exports.deleteEligibilityById = async (req, res, next) => {
    try {
      const deletedEligibility = await Eligibility.findByIdAndDelete(req.params.id);
  
      if (!deletedEligibility) {
        return next(new createError("Eligibility not found", 404));
      }
  
      res.status(200).json({
        status: "success",
        message: "Eligibility deleted successfully",
        data: {
          eligibility: deletedEligibility,
        },
      });
    } catch (error) {
      next(error);
    }
  };

