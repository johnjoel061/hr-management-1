const mongoose = require("mongoose");

const certificateOfEligibilitySchema = new mongoose.Schema(
  {
    cerLastName: { type: String },

    cerFirstName: { type: String },

    cerMiddleName: { type: String },

    cerSuffix: { type: String },

    cerScannedPicture: [ String ],
  },


  { versionKey: false, timestamps: true }
);

const CertificateOfEligibility = mongoose.model("CertificateOfEligibility", certificateOfEligibilitySchema);

module.exports = CertificateOfEligibility;
