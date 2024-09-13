const mongoose = require("mongoose");

const commendationAndAwardSchema = new mongoose.Schema(
  {
    comLastName: { type: String },

    comFirstName: { type: String },

    comMiddleName: { type: String },

    comSuffix: { type: String },

    comScannedPicture: [ String ],
  },

  { versionKey: false, timestamps: true }
);

const CommendationAndAward = mongoose.model("CommendationAndAward", commendationAndAwardSchema);

module.exports = CommendationAndAward;
