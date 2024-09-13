const mongoose = require("mongoose");

const TorSchema = new mongoose.Schema(
  {
    torLastName: { type: String },

    torFirstName: { type: String },

    torMiddleName: { type: String },

    torSuffix: { type: String },

    torScannedPicture: [ String ],
  },


  { versionKey: false, timestamps: true }
);

const Tor = mongoose.model("Tor", TorSchema);

module.exports = Tor;
