const mongoose = require('mongoose');
const moment = require("moment");
const User = require("../models/userModel");
const createError = require("../utils/appError");
const path = require('path');
const fs = require('fs');
const bcrypt = require("bcrypt");


// Get All Users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: "success",
      results: users.length,
      data: users.map((user) => ({
        _id: user._id,
        employeeId: user.employeeId,
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        suffix: user.suffix,
        gender: user.gender,
        civilStatus: user.civilStatus,
        officeAssignment: user.officeAssignment,
        reAssignment: user.reAssignment,
        positionTitle: user.positionTitle,
        salaryGrade: user.salaryGrade,
        stepIncrement: user.stepIncrement,
        hiredDate: user.hiredDate,
        yearsOfService: user.yearsOfService,
        employmentStatus: user.employmentStatus,
        dateOfLastPromotion: user.dateOfLastPromotion,
        salary: user.salary,
        firstDayOfService: user.firstDayOfService, 
        currentEmployment: user.currentEmployment,
        dateOfSeparation: user.dateOfSeparation,
        causeOfSeparation: user.causeOfSeparation,
        dateOfBirth: user.dateOfBirth,
        tin: user.tin,
        gsis: user.gsis,
        pagIbig: user.pagIbig,
        philHealth: user.philHealth,
        bloodType: user.bloodType,
        emergencyContactName: user.emergencyContactName,
        emergencyContact: user.emergencyContact,
        contactNumber: user.contactNumber,
        email: user.email,
        role: user.role,
        educationalBackground: user.educationalBackground,
        employeeEligibilities: user.employeeEligibilities,
        reportTo: user.reportTo,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
    });
  } catch (error) {
    next(new createError(error.message, 500));
  }
};

// Get User By ID
exports.getUserById = async (req, res, next) => {
 
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        _id: user._id,
        employeeId: user.employeeId,
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        suffix: user.suffix,
        gender: user.gender,
        civilStatus: user.civilStatus,
        officeAssignment: user.officeAssignment,
        reAssignment: user.reAssignment,
        positionTitle: user.positionTitle,
        salaryGrade: user.salaryGrade,
        stepIncrement: user.stepIncrement,
        hiredDate: user.hiredDate,
        yearsOfService: user.yearsOfService,
        employmentStatus: user.employmentStatus,
        dateOfLastPromotion: user.dateOfLastPromotion,
        salary: user.salary,
        firstDayOfService: user.firstDayOfService, 
        currentEmployment: user.currentEmployment,
        dateOfSeparation: user.dateOfSeparation,
        causeOfSeparation: user.causeOfSeparation,
        dateOfBirth: user.dateOfBirth,
        tin: user.tin,
        gsis: user.gsis,
        pagIbig: user.pagIbig,
        philHealth: user.philHealth,
        bloodType: user.bloodType,
        emergencyContactName: user.emergencyContactName,
        emergencyContact: user.emergencyContact,
        contactNumber: user.contactNumber,
        avatar: user.avatar,
        signature: user.signature,
        email: user.email,
        role: user.role,
        educationalBackground: user.educationalBackground,
        employeeEligibilities: user.employeeEligibilities,
        reportTo: user.reportTo,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(new createError(error.message, 500));
  }
};


// Update User By ID
exports.updateUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    //Check if password is being updated
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    // Check if hiredDate is being updated
    if (updates.hiredDate) {
      const hiredDate = moment(updates.hiredDate, "MMMM DD, YYYY"); 
      const currentDate = moment(); 
      const yearsOfService = currentDate.diff(hiredDate, "years"); 
      updates.yearsOfService = yearsOfService; 
    }

    const user = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        _id: user._id,
        employeeId: user.employeeId,
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        suffix: user.suffix,
        gender: user.gender,
        civilStatus: user.civilStatus,
        officeAssignment: user.officeAssignment,
        reAssignment: user.reAssignment,
        positionTitle: user.positionTitle,
        salaryGrade: user.salaryGrade,
        stepIncrement: user.stepIncrement,
        hiredDate: user.hiredDate,
        yearsOfService: user.yearsOfService,
        employmentStatus: user.employmentStatus,
        dateOfLastPromotion: user.dateOfLastPromotion,
        salary: user.salary,
        firstDayOfService: user.firstDayOfService, 
        currentEmployment: user.currentEmployment,
        dateOfSeparation: user.dateOfSeparation,
        causeOfSeparation: user.causeOfSeparation,
        dateOfBirth: user.dateOfBirth,
        tin: user.tin,
        gsis: user.gsis,
        pagIbig: user.pagIbig,
        philHealth: user.philHealth,
        bloodType: user.bloodType,
        emergencyContactName: user.emergencyContactName,
        emergencyContact: user.emergencyContact,
        contactNumber: user.contactNumber,
        email: user.email,
        role: user.role,
        educationalBackground: user.educationalBackground,
        employeeEligibilities: user.employeeEligibilities,
        reportTo: user.reportTo,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(new createError(500, error.message));
  }
};


// Delete User By ID
exports.deleteUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully',
      data: {
        _id: user._id,
        employeeId: user.employeeId,
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        suffix: user.suffix,
        gender: user.gender,
        civilStatus: user.civilStatus,
        officeAssignment: user.officeAssignment,
        reAssignment: user.reAssignment,
        positionTitle: user.positionTitle,
        salaryGrade: user.salaryGrade,
        stepIncrement: user.stepIncrement,
        hiredDate: user.hiredDate,
        yearsOfService: user.yearsOfService,
        employmentStatus: user.employmentStatus,
        dateOfLastPromotion: user.dateOfLastPromotion,
        salary: user.salary,
        firstDayOfService: user.firstDayOfService, 
        currentEmployment: user.currentEmployment,
        dateOfSeparation: user.dateOfSeparation,
        causeOfSeparation: user.causeOfSeparation,
        dateOfBirth: user.dateOfBirth,
        tin: user.tin,
        gsis: user.gsis,
        pagIbig: user.pagIbig,
        philHealth: user.philHealth,
        bloodType: user.bloodType,
        emergencyContact: user.emergencyContact,
        contactNumber: user.contactNumber,
        email: user.email,
        password: user.password,
        role: user.role,
        educationalBackground: user.educationalBackground,
        employeeEligibilities: user.employeeEligibilities,
        reportTo: user.reportTo,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(new createError(500, error.message));
  }
};

//Avatar Uploads
exports.uploadAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user already has an avatar
    if (user.avatar) {
      const previousAvatarPath = path.join(__dirname, '..', 'uploads', 'profilePictures', path.basename(user.avatar));

      // Delete the previous avatar file
      fs.unlink(previousAvatarPath, (err) => {
        if (err) {
          console.error(`Failed to delete previous avatar: ${err}`);
        }
      });
    }

    // Assuming `uploads` folder is served statically
    user.avatar = `${req.protocol}://${req.get('host')}/uploads/profilePictures/${req.file.filename}`;
    await user.save();

    res.status(200).json({ message: 'Profile picture updated successfully', avatarUrl: user.avatar });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

//Avatar Uploads
exports.uploadSignature = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User signature not found' });
    }

    // Check if user already has an avatar
    if (user.signature) {
      const previousSignaturePath = path.join(__dirname, '..', 'uploads', 'signatures', path.basename(user.signature));

      // Delete the previous avatar file
      fs.unlink(previousSignaturePath, (err) => {
        if (err) {
          console.error(`Failed to delete previous signature: ${err}`);
        }
      });
    }

    // Assuming `uploads` folder is served statically
    user.signature = `${req.protocol}://${req.get('host')}/uploads/signatures/${req.file.filename}`;
    await user.save();

    res.status(200).json({ message: 'User signature updated successfully', signatureUrl: user.signature });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


