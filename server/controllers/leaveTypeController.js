const LeaveType = require("../models/leaveTypeModel");
const createError = require("../utils/appError");

exports.addLeaveType = async (req, res, next) => {
  try {
    // Check if eligibility already exists
    const existingLeaveType = await LeaveType.findOne({
      leaveType: req.body.leaveType,
    });

    if (existingLeaveType) {
      return next(new createError("Leave Type already exists!", 400));
    }

    // Create new eligibility
    const newLeaveType = new LeaveType({
        leaveType: req.body.leaveType,
    });

    // Save the new eligibility to the database
    await newLeaveType.save();

    // Respond with success message
    res.status(201).json({
      status: "success",
      message: "Leave Type added successfully",
      data: {
        leaveType: newLeaveType,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Controller to get all eligibilities
exports.getAllLeaveType = async (req, res, next) => {
  try {
    const leaveTypes = await LeaveType.find();

    res.status(200).json({
      status: "success",
      results: leaveTypes.length,
      data: leaveTypes.map((leaveType) => ({
        _id: leaveType._id,
        leaveType: leaveType.leaveType,
        createdAt: leaveType.createdAt,
        updatedAt: leaveType.updatedAt,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// Controller to get eligibility by ID
exports.getLeaveTypeById = async (req, res, next) => {
  try {
    const leaveType = await LeaveType.findById(req.params.id);

    if (!leaveType) {
      return next(new createError("Leave Type not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        leaveType,
      },
    });
  } catch (error) {
    next(error);
  }
};


// Controller to update eligibility by ID
exports.updateLeaveTypeById = async (req, res, next) => {
  try {
    const updatedLeaveType = await LeaveType.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedLeaveType) {
      return next(new createError("Leave Type not found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Leave Type updated successfully",
      data: {
        leaveType: updatedLeaveType,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Controller to delete eligibility by ID
exports.deleteLeaveTypeById = async (req, res, next) => {
    try {
      const deletedLeaveType = await LeaveType.findByIdAndDelete(req.params.id);
  
      if (!deletedLeaveType) {
        return next(new createError("Leave Type not found", 404));
      }
  
      res.status(200).json({
        status: "success",
        message: "Leave Type deleted successfully",
        data: {
          leaveType: deletedLeaveType,
        },
      });
    } catch (error) {
      next(error);
    }
  };

