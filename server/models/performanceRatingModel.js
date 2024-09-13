const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PerformanceRatingSchema = new Schema({
  semester: { type: String },
  year: { type: String },
  numericalRating: { type: String },
  adjectivalRating: { type: String },
},
  { versionKey: false, timestamps: true }
);

module.exports = PerformanceRatingSchema;
