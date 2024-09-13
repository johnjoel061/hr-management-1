const mongoose = require("mongoose");

const designationSchema = new mongoose.Schema(
  {
    desLastName: { type: String },

    desFirstName: { type: String },

    desMiddleName: { type: String },

    desSuffix: { type: String },

    desScannedPicture: [ String ],
  },


  { versionKey: false, timestamps: true }
);

const Designation = mongoose.model("Designation", designationSchema);

module.exports = Designation;
