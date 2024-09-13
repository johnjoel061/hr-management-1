const mongoose = require("mongoose");

const clearanceMoneyPropertyAcctSchema = new mongoose.Schema(
  {
    cleLastName: { type: String },

    cleFirstName: { type: String },

    cleMiddleName: { type: String },

    cleSuffix: { type: String },

    cleScannedPicture: [ String ],
  },

  { versionKey: false, timestamps: true }
);

const ClearanceMoneyPropertyAcct = mongoose.model("ClearanceMoneyPropertyAcct", clearanceMoneyPropertyAcctSchema);

module.exports = ClearanceMoneyPropertyAcct;
