const User = require("../models/userModel");

// Add a new learning development entry
exports.addPerformanceRating = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const newPerformanceRating = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    user.performanceRating.push(newPerformanceRating);
    await user.save();

    res.status(201).json({ status: "success", data: user });
  } catch (error) {
    next(error);
  }
};

// Update a specific learning development entry
exports.updatePerformanceRatingById = async (req, res, next) => {
  try {
    const { userId, prId } = req.params;
    const updatedData = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    const prIndex = user.performanceRating.findIndex(
      (pr) => pr._id.toString() === prId
    );

    if (prIndex === -1) {
      return res
        .status(404)
        .json({
          status: "error",
          message: "Performance Rating entry not found",
        });
    }

    user.performanceRating[prIndex] = {
      ...user.performanceRating[prIndex]._doc,
      ...updatedData,
    };
    await user.save();

    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    next(error);
  }
};

// Delete a specific learning development entry
exports.deletePerformanceRatingById = async (req, res, next) => {
  try {
    const { userId, prId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    user.performanceRating = user.performanceRating.filter(
      (pr) => pr._id.toString() !== prId
    );
    await user.save();

    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    next(error);
  }
};

// Get all learning development entries for a user
exports.getAllPerformanceRating = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    res.status(200).json({ status: "success", data: user.performanceRating });
  } catch (error) {
    next(error);
  }
};

// Get a specific learning development entry by ID
exports.getPerformanceRatingById = async (req, res, next) => {
  try {
    const { userId, prId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    const performanceRating = user.performanceRating.id(prId);

    if (!performanceRating) {
      return res
        .status(404)
        .json({
          status: "error",
          message: "Performance Rating entry not found",
        });
    }

    res.status(200).json({ status: "success", data: performanceRating });
  } catch (error) {
    next(error);
  }
};

