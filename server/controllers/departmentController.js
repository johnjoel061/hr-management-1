const Department = require("../models/departmentModel");
const createError = require("../utils/appError");

// Controller to add  Department
exports.addDepartment = async (req, res, next) => {
  try {
    // Check if eligibility already exists
    const existingDepartment = await Department.findOne({
      department: req.body.department,
    });

    if (existingDepartment) {
      return next(new createError("Department already exists!", 400));
    }

    // Create new eligibility
    const newDepartment = new Department({
        department: req.body.department,
    });

    // Save the new eligibility to the database
    await newDepartment.save();

    // Respond with success message
    res.status(201).json({
      status: "success",
      message: "Department added successfully",
      data: {
        department: newDepartment,
      },
    });
  } catch (error) {
    next(error);
  }
};


// Controller to get all Department
exports.getAllDepartment = async (req, res, next) => {
  try {
    const department = await Department.find();

    res.status(200).json({
      status: "success",
      results: department.length,
      data: department.map((depart) => ({
        _id: depart._id,
        department: depart.department,
        createdAt: depart.createdAt,
        updatedAt: depart.updatedAt,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// Controller to get Department by ID
exports.getDepartmentById = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return next(new createError("Department not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        department,
      },
    });
  } catch (error) {
    next(error);
  }
};


// Controller to update Department by ID
exports.updateDepartmentById = async (req, res, next) => {
  try {
    const updatedDepartment = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedDepartment) {
      return next(new createError("Department not found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Department updated successfully",
      data: {
        department: updatedDepartment,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Controller to delete eligibility by ID
exports.deleteDepartmentById = async (req, res, next) => {
    try {
      const deletedDepartment = await Department.findByIdAndDelete(req.params.id);
  
      if (!deletedDepartment) {
        return next(new createError("Department not found", 404));
      }
  
      res.status(200).json({
        status: "success",
        message: "Department deleted successfully",
        data: {
          department: deletedDepartment,
        },
      });
    } catch (error) {
      next(error);
    }
  };

