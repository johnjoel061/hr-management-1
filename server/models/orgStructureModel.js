const mongoose = require("mongoose");

const orgStructureSchema = new mongoose.Schema(
  {
    orgTitle: { type: String },

    orgScannedPicture: [ String ],
  },

  { versionKey: false, timestamps: true }
);

const OrgStructure = mongoose.model("OrgStructure", orgStructureSchema);

module.exports = OrgStructure;
