const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LeaveCreditSchema = new Schema({
  leaveType: { type: String },
  credit: { type: String },
},
    { versionKey: false, timestamps: true }
);

module.exports = LeaveCreditSchema;
