const User = require("../models/userModel");

// Add a new learning development entry
exports.addLeaveRecord = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const newLeaveRecord = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    user.leaveRecord.push(newLeaveRecord);
    await user.save();

    res.status(201).json({ status: "success", data: user });
  } catch (error) {
    next(error);
  }
};

// Update a specific learning development entry
exports.updateLeaveRecordById = async (req, res, next) => {
  try {
    const { userId, lrId } = req.params;
    const updatedData = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    const lrIndex = user.leaveRecord.findIndex(
      (lr) => lr._id.toString() === lrId
    );

    if (lrIndex === -1) {
      return res
        .status(404)
        .json({
          status: "error",
          message: "Leave Record entry not found",
        });
    }

    user.leaveRecord[lrIndex] = {
      ...user.leaveRecord[lrIndex]._doc,
      ...updatedData,
    };
    await user.save();

    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    next(error);
  }
};

// Delete a specific learning development entry
exports.deleteLeaveRecordById = async (req, res, next) => {
  try {
    const { userId, lrId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    user.leaveRecord = user.leaveRecord.filter(
      (lr) => lr._id.toString() !== lrId
    );
    await user.save();

    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    next(error);
  }
};

// Get all learning development entries for a user
exports.getAllLeaveRecord = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    res.status(200).json({ status: "success", data: user.leaveRecord });
  } catch (error) {
    next(error);
  }
};

// Get a specific learning development entry by ID
exports.getLeaveRecordById = async (req, res, next) => {
  try {
    const { userId, lrId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    const leaveRecord = user.leaveRecord.id(lrId);

    if (!leaveRecord) {
      return res
        .status(404)
        .json({
          status: "error",
          message: "Leave Record entry not found",
        });
    }

    res.status(200).json({ status: "success", data: leaveRecord });
  } catch (error) {
    next(error);
  }
};

