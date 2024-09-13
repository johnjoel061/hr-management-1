const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LeaveRecordSchema = new Schema({
  period: { type: String },
  particular: { type: String },
  typeOfLeave: { type: String },
  earned: { type: String },
  absentUnderWithPay: { type: String },
  balance: { type: String },
  absentUnderWithoutPay: { type: String },
  dateTakenOnForLeave: { type: String },
  actionTakenOnForLeave: { type: String },
},
    { versionKey: false, timestamps: true }
);

module.exports = LeaveRecordSchema;
