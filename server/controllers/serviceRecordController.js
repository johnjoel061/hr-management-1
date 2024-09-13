const User = require("../models/userModel");

// Add a new learning development entry
exports.addServiceRecord = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const newServiceRecord = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    user.serviceRecord.push(newServiceRecord);
    await user.save();

    res.status(201).json({ status: "success", data: user });
  } catch (error) {
    next(error);
  }
};

// Update a specific learning development entry
exports.updateServiceRecordById = async (req, res, next) => {
  try {
    const { userId, srId } = req.params;
    const updatedData = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    const srIndex = user.serviceRecord.findIndex(
      (sr) => sr._id.toString() === srId
    );

    if (srIndex === -1) {
      return res
        .status(404)
        .json({
          status: "error",
          message: "Service Record entry not found",
        });
    }

    user.serviceRecord[srIndex] = {
      ...user.serviceRecord[srIndex]._doc,
      ...updatedData,
    };
    await user.save();

    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    next(error);
  }
};

// Delete a specific learning development entry
exports.deleteServiceRecordById = async (req, res, next) => {
  try {
    const { userId, srId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    user.serviceRecord = user.serviceRecord.filter(
      (sr) => sr._id.toString() !== srId
    );
    await user.save();

    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    next(error);
  }
};

// Get all learning development entries for a user
exports.getAllServiceRecord = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    res.status(200).json({ status: "success", data: user.serviceRecord });
  } catch (error) {
    next(error);
  }
};

// Get a specific learning development entry by ID
exports.getServiceRecordById = async (req, res, next) => {
  try {
    const { userId, srId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    const serviceRecord = user.serviceRecord.id(srId);

    if (!serviceRecord) {
      return res
        .status(404)
        .json({
          status: "error",
          message: "Service Record entry not found",
        });
    }

    res.status(200).json({ status: "success", data: serviceRecord });
  } catch (error) {
    next(error);
  }
};

