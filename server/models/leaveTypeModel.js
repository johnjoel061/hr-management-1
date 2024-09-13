const mongoose = require("mongoose");

const leaveTypeSchema = new mongoose.Schema(
    {
        leaveType: { type: String },
    },

    { versionKey: false, timestamps: true }
);

const LeaveType = mongoose.model('LeaveType', leaveTypeSchema);

module.exports = LeaveType;