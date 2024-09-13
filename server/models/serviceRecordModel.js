const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ServiceRecordSchema = new Schema({
  inclusiveDateFrom: { type: String },
  inclusiveDateTo: { type: String },
  designation: { type: String },
  status: { type: String },
  salary: { type: String },
  station: { type: String },
  branch: { type: String },
  wPay: { type: String },
  separationDate: { type: String },
  separationCause: { type: String },
},
    { versionKey: false, timestamps: true }
);

module.exports = ServiceRecordSchema;
