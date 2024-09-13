const mongoose = require("mongoose");

const salnSchema = new mongoose.Schema(
  {
    salLastName: { type: String },

    salFirstName: { type: String },

    salMiddleName: { type: String },

    salSuffix: { type: String },

    salScannedPicture: [ String ],
  },


  { versionKey: false, timestamps: true }
);

const Saln = mongoose.model("Saln", salnSchema);

module.exports = Saln;
