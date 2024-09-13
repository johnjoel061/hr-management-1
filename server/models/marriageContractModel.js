const mongoose = require("mongoose");

const marriageContractSchema = new mongoose.Schema(
  {
    marLastName: { type: String },

    marFirstName: { type: String },

    marMiddleName: { type: String },

    marSuffix: { type: String },

    marScannedPicture: [ String ],
  },


  { versionKey: false, timestamps: true }
);

const MarriageCertificate = mongoose.model("MarriageCertificate", marriageContractSchema);

module.exports = MarriageCertificate;
