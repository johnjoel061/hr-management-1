const Faq = require("../models/faqModel");
const createError = require("../utils/appError");

// Controller to add  Department
exports.addFaq = async (req, res, next) => {
  try {
    // Check if FAQ already exists
    const existingFaq = await Faq.findOne({ faq: req.body.faq });

    if (existingFaq) {
      return next(createError(400, "FAQ already exists!"));
    }

    // Create new FAQ
    const newFaq = new Faq({
      faq: req.body.faq,
      faqAnswer: req.body.faqAnswer,
    });

    // Save the new FAQ to the database
    await newFaq.save();

    // Respond with success message
    res.status(201).json({
      status: "success",
      message: "FAQ added successfully",
      data: {
        _id: newFaq._id,
        faq: newFaq.faq,
        faqAnswer: newFaq.faqAnswer,
        createdAt: newFaq.createdAt,
        updatedAt: newFaq.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};


// Controller to get all Department
exports.getAllFaq = async (req, res, next) => {
  try {
    const faqs = await Faq.find();

    res.status(200).json({
      status: "success",
      results: faqs.length,
      data: faqs.map((faq) => ({
        _id: faq._id,
        faq: faq.faq,
        faqAnswer: faq.faqAnswer,
        createdAt: faq.createdAt,
        updatedAt: faq.updatedAt,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// Controller to get Department by ID
exports.getFaqById = async (req, res, next) => {
  try {
    const faqs = await Faq.findById(req.params.id);

    if (!faqs) {
      return next(new createError("Faq not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        faqs,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Controller to update Department by ID
exports.updateFaqById = async (req, res, next) => {
  try {
    const updatedFaq = await Faq.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedFaq) {
      return next(new createError("Faq not found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Faq updated successfully",
      data: {
        faq: updatedFaq,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Controller to delete eligibility by ID
exports.deleteFaqById = async (req, res, next) => {
    try {
      const deletedFaq = await Faq.findByIdAndDelete(req.params.id);
  
      if (!deletedFaq) {
        return next(new createError("Faq not found", 404));
      }
  
      res.status(200).json({
        status: "success",
        message: "Faq deleted successfully",
        data: {
          faq: deletedFaq,
        },
      });
    } catch (error) {
      next(error);
    }
  };

