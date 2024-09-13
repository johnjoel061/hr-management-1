const mongoose = require("mongoose");

const personalDataSheetSchema = new mongoose.Schema(
  {
    pdsFirstName: { type: String },

    pdsLastName: { type: String },

    pdsMiddleName: { type: String },

    pdsSuffix: { type: String },

    pdsScannedPicture: [ String ],
  },


  { versionKey: false, timestamps: true }
);

const PersonalDataSheet = mongoose.model("PersonalDataSheet", personalDataSheetSchema);

module.exports = PersonalDataSheet;
