const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    lguName: { type: String },

    lguLogo: { type: String },

    lguAuthLogo: { type: String },

    lguOrgStructure: { type: String },

    lguGmail: {type: String},
  },

  { versionKey: false, timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);

module.exports = Settings;
