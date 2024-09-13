const mongoose = require("mongoose");

const copiesOfDiscipActionSchema = new mongoose.Schema(
  {
    copLastName: { type: String },

    copFirstName: { type: String },

    copMiddleName: { type: String },

    copSuffix: { type: String },

    copScannedPicture: [ String ],
  },

  { versionKey: false, timestamps: true }
);

const CopiesOfDiscipAction = mongoose.model("CopiesOfDiscipAction", copiesOfDiscipActionSchema);

module.exports = CopiesOfDiscipAction;
