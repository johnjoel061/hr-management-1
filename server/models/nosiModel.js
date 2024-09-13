const mongoose = require("mongoose");

const nosiSchema = new mongoose.Schema(
  {
    nosLastName: { type: String },

    nosFirstName: { type: String },

    nosMiddleName: { type: String },

    nosSuffix: { type: String },

    nosScannedPicture: [ String ],
  },


  { versionKey: false, timestamps: true }
);

const Nosi = mongoose.model("Nosi", nosiSchema);

module.exports = Nosi;
