const User = require("../models/userModel");

// Add a new learning development entry
exports.addAward = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const newAward = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    user.award.push(newAward);
    await user.save();

    res.status(201).json({ status: "success", data: user });
  } catch (error) {
    next(error);
  }
};

// Update a specific learning development entry
exports.updateAwardById = async (req, res, next) => {
  try {
    const { userId, awId } = req.params;
    const updatedData = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    const awIndex = user.award.findIndex(
      (aw) => aw._id.toString() === awId
    );

    if (awIndex === -1) {
      return res
        .status(404)
        .json({
          status: "error",
          message: "Award entry not found",
        });
    }

    user.award[awIndex] = {
      ...user.award[awIndex]._doc,
      ...updatedData,
    };
    await user.save();

    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    next(error);
  }
};

// Delete a specific learning development entry
exports.deleteAwardById = async (req, res, next) => {
  try {
    const { userId, awId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    user.award = user.award.filter(
      (aw) => aw._id.toString() !== awId
    );
    await user.save();

    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    next(error);
  }
};

// Get all learning development entries for a user
exports.getAllAward = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    res.status(200).json({ status: "success", data: user.award });
  } catch (error) {
    next(error);
  }
};

// Get a specific learning development entry by ID
exports.getAwardById = async (req, res, next) => {
  try {
    const { userId, awId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    const award = user.award.id(awId);

    if (!award) {
      return res
        .status(404)
        .json({
          status: "error",
          message: "Award entry not found",
        });
    }

    res.status(200).json({ status: "success", data: award });
  } catch (error) {
    next(error);
  }
};

