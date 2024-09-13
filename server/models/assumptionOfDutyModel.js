const mongoose = require("mongoose");

const AssumptionOfDutySchema = new mongoose.Schema(
  {
    assLastName: { type: String },

    assFirstName: { type: String },

    assMiddleName: { type: String },

    assSuffix: { type: String },

    assScannedPicture: [ String ],
  },


  { versionKey: false, timestamps: true }
);

const AssumptionOfDuty = mongoose.model("AssumptionOfDuty", AssumptionOfDutySchema);

module.exports = AssumptionOfDuty;
