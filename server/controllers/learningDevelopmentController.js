const User = require("../models/userModel");

// Add a new learning development entry
exports.addLearningDevelopment = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const newLearningDevelopment = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    user.learningDevelopment.push(newLearningDevelopment);
    await user.save();

    res.status(201).json({ status: "success", data: user });
  } catch (error) {
    next(error);
  }
};

// Update a specific learning development entry
exports.updateLearningDevelopmentById = async (req, res, next) => {
  try {
    const { userId, ldId } = req.params;
    const updatedData = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    const ldIndex = user.learningDevelopment.findIndex(
      (ld) => ld._id.toString() === ldId
    );

    if (ldIndex === -1) {
      return res
        .status(404)
        .json({
          status: "error",
          message: "Learning development entry not found",
        });
    }

    user.learningDevelopment[ldIndex] = {
      ...user.learningDevelopment[ldIndex]._doc,
      ...updatedData,
    };
    await user.save();

    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    next(error);
  }
};

// Delete a specific learning development entry
exports.deleteLearningDevelopmentById = async (req, res, next) => {
  try {
    const { userId, ldId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    user.learningDevelopment = user.learningDevelopment.filter(
      (ld) => ld._id.toString() !== ldId
    );
    await user.save();

    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    next(error);
  }
};

// Get all learning development entries for a user
exports.getAllLearningDevelopment = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    res.status(200).json({ status: "success", data: user.learningDevelopment });
  } catch (error) {
    next(error);
  }
};

// Get a specific learning development entry by ID
exports.getLearningDevelopmentById = async (req, res, next) => {
  try {
    const { userId, ldId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    const learningDevelopment = user.learningDevelopment.id(ldId);

    if (!learningDevelopment) {
      return res
        .status(404)
        .json({
          status: "error",
          message: "Learning development entry not found",
        });
    }

    res.status(200).json({ status: "success", data: learningDevelopment });
  } catch (error) {
    next(error);
  }
};
