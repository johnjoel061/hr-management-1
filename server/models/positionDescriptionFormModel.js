const mongoose = require("mongoose");

const positionDescriptionFormSchema = new mongoose.Schema(
  {
    posLastName: { type: String },

    posFirstName: { type: String },

    posMiddleName: { type: String },

    posSuffix: { type: String },

    posScannedPicture: [ String ],
  },


  { versionKey: false, timestamps: true }
);

const PositionDescriptionForm = mongoose.model("PositionDescriptionForm", positionDescriptionFormSchema);

module.exports = PositionDescriptionForm;
