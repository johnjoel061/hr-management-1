const User = require("../models/userModel");
const Settings = require("../models/settingsModel");
const createError = require("../utils/appError");
const crypto = require("crypto");
require("dotenv").config(); // Load environment variables
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const moment = require("moment");

// Register User
exports.signup = async (req, res, next) => {
  try {
    // Check if user already exists
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      return next(new createError("User already exists!", 400));
    }

    // Hash the password---------NEED TO CHANGE IF CLIENT REQUEST
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    
    // Calculate years of service
    const hiredDate = moment(req.body.hiredDate, "MMMM DD, YYYY"); // Convert hiredDate from the specified format
    const currentDate = moment(); // Get the current date
    const yearsOfService = currentDate.diff(hiredDate, "years"); // Calculate the difference in years


    // Create new user
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
      yearsOfService, 
    });

    // Assign JWT (JSON Web Token)
    const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7 days",
    });

    // Send success message to user's email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.LGU_GMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Send registration success email with login details
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: newUser.email, // List of recipients
      subject: "Registration Successful", // Subject line
      text: `Dear ${newUser.firstName},\n\nYou have been successfully registered in LGU HRIS. Here are your login details:\n\nEmail: ${newUser.email}\nPassword: ${req.body.password}\n\nPlease change your password after your first login for security purposes.\n\nBest regards,\nYour LGU Team`, // Plain text body
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    // Respond with the token
    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      token,
      user: {
        _id: newUser._id,
        employeeId: newUser.employeeId,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        middleName: newUser.middleName,
        suffix: newUser.suffix,
        gender: newUser.gender,
        civilStatus: newUser.civilStatus,
        officeAssignment: newUser.officeAssignment,
        reAssignment: newUser.reAssignment,
        positionTitle: newUser.positionTitle,
        firstDayOfService: newUser.firstDayOfService,
        salary: newUser.salary,
        salaryGrade: newUser.salaryGrade,
        stepIncrement: newUser.stepIncrement,
        hiredDate: newUser.hiredDate,
        yearsOfService: newUser.yearsOfService,
        employmentStatus: newUser.employmentStatus,
        dateOfLastPromotion: newUser.dateOfLastPromotion,
        currentEmployment: newUser.currentEmployment,
        dateOfSeparation: newUser.dateOfSeparation,
        causeOfSeparation: newUser.causeOfSeparation,
        dateOfBirth: newUser.dateOfBirth,
        tin: newUser.tin,
        gsis: newUser.gsis,
        pagIbig: newUser.pagIbig,
        philHealth: newUser.philHealth,
        bloodType: newUser.bloodType,
        emergencyContactName: newUser.emergencyContactName,
        emergencyContact: newUser.emergencyContact,
        contactNumber: newUser.contactNumber,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
        signature: newUser.signature,
        reportTo: newUser.reportTo,
        educationalBackground: newUser.educationalBackground,
        employeeEligibilities: newUser.employeeEligibilities,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login User
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return next(new createError("Please provide email and password!", 400));
    }

    // Find user by email
    const user = await User.findOne({ email: email });

    if (!user) {
      return next(new createError("User not found!", 404));
    }

    // Check if password is correct =========CHANGE LATER BY THE DECISION OF CLIENT
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    //const isPasswordCorrect = password === user.password;

    if (!isPasswordCorrect) {
      return next(new createError("Invalid email or password!", 401));
    }

    // Assign JWT (JSON Web Token)
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7 days",
    });

    // Respond with the token
    res.status(200).json({
      status: "success",
      token,
      message: "Logged in successfully",

      user: {
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
        salary: user.salary,
        firstDayOfService: user.firstDayOfService,
        stepIncrement: user.stepIncrement,
        hiredDate: user.hiredDate,
        yearsOfService: user.yearsOfService,
        employmentStatus: user.employmentStatus,
        dateOfLastPromotion: user.dateOfLastPromotion,
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
        avatar: user.avatar,
        signature: user.signature,
        reportTo: user.reportTo,
        educationalBackground: user.educationalBackground,
        employeeEligibilities: user.employeeEligibilities,
        learningDevelopment: user.learningDevelopment.map((entry) => ({
          trainingTitle: entry.trainingTitle,
          dateStart: entry.dateStart,
          dateEnd: entry.dateEnd,
          numberOfHours: entry.numberOfHours,
          ldType: entry.ldType,
          venue: entry.venue,
          sponsoredBy: entry.sponsoredBy,
          _id: entry._id,
        })),
        leaveRecord: user.leaveRecord.map((leave) => ({
          period: leave.period,
          particular: leave.particular,
          typeOfLeave: leave.typeOfLeave,
          earned: leave.earned,
          absentUnderWithPay: leave.absentUnderWithPay,
          balance: leave.balance,
          absentUnderWithoutPay: leave.absentUnderWithoutPay,
          dateTakenOnForLeave: leave.dateTakenOnForLeave,
          actionTakenOnForLeave: leave.actionTakenOnForLeave,
          _id: leave._id,
        })),
        serviceRecord: user.serviceRecord.map((service) => ({
          inclusiveDateFrom: service.inclusiveDateFrom,
          inclusiveDateTo: service.inclusiveDateTo,
          designation: service.designation,
          status: service.status,
          salary: service.salary,
          station: service.station,
          branch: service.branch,
          wPay: service.wPay,
          separationDate: service.separationDate,
          separationCause: service.separationCause,
          _id: service._id,
        })),
        performanceRating: user.performanceRating.map((perform) => ({
          semester: perform.semester,
          year: perform.year,
          numericalRating: perform.numericalRating,
          adjectivalRating: perform.adjectivalRating,
          _id: perform._id,
        })),
        award: user.award.map((awr) => ({
          nameOfAward: awr.nameOfAward,
          levelOfAward: awr.levelOfAward,
          dateOfAward: awr.dateOfAward,
          issuedBy: awr.issuedBy,
          _id: awr._id,
        })),
        leaveCredit: user.leaveCredit.map((cred) => ({
          leaveType: cred.leaveType,
          credit: cred.credit,
          _id: cred._id,
        })),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },


    });
  } catch (error) {
    next(new createError(error.message, 500));
  }
};

// Generate Verification Code and Send Email
exports.requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const verificationCode = crypto
      .randomBytes(3)
      .toString("hex")
      .toUpperCase(); // 6 character code

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = Date.now() + 3600000; // 1 hour from now
    await user.save();

    // Send verification code to user's email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.LGU_GMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.LGU_GMAIL,
      to: user.email,
      subject: "Password Reset Verification Code",
      text: `Your reset password verification code is ${verificationCode}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      status: "success",
      message: "Verification code sent to email",
    });
  } catch (error) {
    next(new createError(500, error.message));
  }
};

// Verify Code and Update Password
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, verificationCode, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    if (
      user.verificationCode !== verificationCode ||
      user.verificationCodeExpires < Date.now()
    ) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or expired verification code",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;

    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password has been reset successfully",
    });
  } catch (error) {
    next(new createError(500, error.message));
  }
};
