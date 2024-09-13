// models/LearningDevelopment.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LearningDevelopmentSchema = new Schema({
  trainingTitle: { type: String },
  dateStart: { type: String },
  dateEnd: { type: String },
  numberOfHours: { type: Number },
  ldType: { type: String },
  venue: { type: String },
  sponsoredBy: { type: String },
},
  { versionKey: false, timestamps: true }
);

module.exports = LearningDevelopmentSchema;
