const mongoose = require("mongoose");

const OathOfOfficeSchema = new mongoose.Schema(
  {
    oatLastName: { type: String },

    oatFirstName: { type: String },

    oatMiddleName: { type: String },

    oatSuffix: { type: String },

    oatScannedPicture: [ String ],
  },


  { versionKey: false, timestamps: true }
);

const OathOfOffice = mongoose.model("OathOfOffice", OathOfOfficeSchema);

module.exports = OathOfOffice;
