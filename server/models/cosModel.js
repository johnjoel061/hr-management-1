const mongoose = require("mongoose");

const CosSchema = new mongoose.Schema(
  {
    cosLastName: { type: String },

    cosFirstName: { type: String },

    cosMiddleName: { type: String },

    cosSuffix: { type: String },
    cosScannedPicture: [ String ],
  },

  { versionKey: false, timestamps: true }
);

const Cos = mongoose.model("Cos", CosSchema);

module.exports = Cos;
