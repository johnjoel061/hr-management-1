const User = require("../models/userModel");

// Add a new learning development entry
exports.addLeaveCredit = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const newLeaveCredit = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    user.leaveCredit.push(newLeaveCredit);
    await user.save();

    res.status(201).json({ status: "success", data: user });
  } catch (error) {
    next(error);
  }
};

// Update a specific learning development entry
exports.updateLeaveCreditById = async (req, res, next) => {
  try {
    const { userId, lcId } = req.params;
    const updatedData = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    const lcIndex = user.leaveCredit.findIndex(
      (lc) => lc._id.toString() === lcId
    );

    if (lcIndex === -1) {
      return res
        .status(404)
        .json({
          status: "error",
          message: "Leave Credit entry not found",
        });
    }

    user.leaveCredit[lcIndex] = {
      ...user.leaveCredit[lcIndex]._doc,
      ...updatedData,
    };
    await user.save();

    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    next(error);
  }
};

// Delete a specific learning development entry
exports.deleteLeaveCreditById = async (req, res, next) => {
  try {
    const { userId, lcId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    user.leaveCredit = user.leaveCredit.filter(
      (lc) => lc._id.toString() !== lcId
    );
    await user.save();

    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    next(error);
  }
};

// Get all learning development entries for a user
exports.getAllLeaveCredit = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    res.status(200).json({ status: "success", data: user.leaveCredit });
  } catch (error) {
    next(error);
  }
};

// Get a specific learning development entry by ID
exports.getLeaveCreditById = async (req, res, next) => {
  try {
    const { userId, lcId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    const leaveCredit = user.leaveCredit.id(lcId);

    if (!leaveCredit) {
      return res
        .status(404)
        .json({
          status: "error",
          message: "Leave Credit entry not found",
        });
    }

    res.status(200).json({ status: "success", data: leaveCredit });
  } catch (error) {
    next(error);
  }
};

