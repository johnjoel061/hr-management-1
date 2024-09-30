const mongoose = require("mongoose");
const LearningDevelopmentSchema = require("./learningDevelopmentModel"); // Import the schema
const LeaveRecordSchema = require("./leaveRecordModel"); // Import the schema
const ServiceRecordSchema = require("./serviceRecordModel"); // Import the schema
const PerformanceRatingSchema = require("./performanceRatingModel"); // Import the schema
const AwardSchema = require("./awardModel");

const userSchema = new mongoose.Schema(
  {
    employeeId: { type: String, unique: true, required: true },
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    middleName: { type: String, required: true },
    suffix: { type: String, default: "NONE" },
    gender: { type: String, enum: ["Male", "Female"], default: "Male" },
    civilStatus: {
      type: String,
      enum: [
        "Single",
        "Married",
        "Annulled",
        "Widowed",
        "Legally Separated",
        "Divorced",
      ],
      default: "Single",
    },

    dateOfSeparation: { type: String, },
    causeOfSeparation: { type: String },
    officeAssignment: { type: String },
    reAssignment: { type: String },
    positionTitle: { type: String },
    firstDayOfService: { type: String },
    salaryGrade: { type: String },
    salary: {type: String},
    stepIncrement: { type: String },
    hiredDate: { type: String, required: true },
    yearsOfService: { type: String },

    currentEmployment: {
      type: String,
      enum: [
        "Permanent", 
        "Temporary",
        "Casual", 
        "Co-Terminus",
      ],
      default: "Permanent",
    },
    dateOfLastPromotion: { type: String, },
    employmentStatus: { 
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
    dateOfBirth: { type: String },
    tin: { type: String },
    gsis: { type: String },
    pagIbig: { type: String },
    philHealth: { type: String },
    bloodType: {
      type: String,
      enum: ["A", "B", "AB", "O"],
      default: "O",
    },

    avatar: { type: String }, // Add this line
    signature: { type: String },
    reportTo: { type: String },
    emergencyContactName: { type: String },
    emergencyContact: { type: String },
    contactNumber: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["M-ADMIN", "ADMIN", "HOD", "EMPLOYEE"],
      default: "EMPLOYEE",
    },
    
    educationalBackground: { type: String },
    employeeEligibilities: [{ type: String }], 
    learningDevelopment: [LearningDevelopmentSchema],
    leaveRecord: [LeaveRecordSchema],
    serviceRecord: [ServiceRecordSchema],
    performanceRating: [PerformanceRatingSchema],
    award: [AwardSchema],

    verificationCode: { type: String, default: '' },
    verificationCodeExpires: { type: Date, default: null },
  },
  
  { versionKey: false, timestamps: true }
);


const User = mongoose.model("User", userSchema);

module.exports = User;
