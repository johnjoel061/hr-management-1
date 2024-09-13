const mongoose = require("mongoose");

const nbiClearanceSchema = new mongoose.Schema(
  {
    nbiLastName: { type: String },

    nbiFirstName: { type: String },

    nbiMiddleName: { type: String },

    nbiSuffix: { type: String },

    nbiScannedPicture: [ String ],
  },


  { versionKey: false, timestamps: true }
);

const NbiClearance = mongoose.model("NbiClearance", nbiClearanceSchema);

module.exports = NbiClearance;
