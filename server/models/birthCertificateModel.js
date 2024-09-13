const mongoose = require("mongoose");

const birthCertificateSchema = new mongoose.Schema(
  {
    birLastName: { type: String },

    birFirstName: { type: String },

    birMiddleName: { type: String },

    birSuffix: { type: String },

    birScannedPicture: [ String ],
  },


  { versionKey: false, timestamps: true }
);

const BirthCertificate = mongoose.model("BirthCertificate", birthCertificateSchema);

module.exports = BirthCertificate;
