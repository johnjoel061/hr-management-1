const mongoose = require("mongoose");

const leaveRequestSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        middleName: { type: String },
        suffix: { type: String,  default: 'NONE' },
        gmail: { type: String, required: true },
        position: { type: String, required: true },
        department: { type: String, required: true },
        salary: { type: String, required: true },
        signature: { type: String, required: true },
        dateOfFiling: { type: Date, default: Date.now }, // Store the date of filing as a Date

        leaveType: { type: String },
        otherLeaveType: { type: String },
        vacationSpecialLeave: { type: String },
        vacationSpecialLeaveAddress: { type: String },

        sickLeave: { type: String },
        sickLeaveIllness: { type: String },

        womanSpecialLeave: { type: String },
        studyLeave: { type: String },
        otherPurpose: { type: String },
        numberOfWorkDays: { type: String, required: true },
        commutation: { type: String },

        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        },

        adminApproval:{type: String,  default: 'pending'},
        hodApproval:{type: String,  default: 'pending'},
        mAdminApproval: {type: String,  default: 'pending'},
        rejectReason: {type: String},
    },

    { versionKey: false, timestamps: true }
);

const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);

module.exports = LeaveRequest;
