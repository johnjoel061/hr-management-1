const mongoose = require("mongoose");

const medicalCertificateSchema = new mongoose.Schema(
  {
    medLastName: { type: String },

    medFirstName: { type: String },

    medMiddleName: { type: String },

    medSuffix: { type: String },

    medScannedPicture: [ String ],
  },


  { versionKey: false, timestamps: true }
);

const MedicalCertificate = mongoose.model("MedicalCertificate", medicalCertificateSchema);

module.exports = MedicalCertificate;
