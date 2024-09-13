const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    appLastName: { type: String },

    appFirstName: { type: String },

    appMiddleName: { type: String },

    appSuffix: { type: String },

    appScannedPicture: [ String ],
  },

  { versionKey: false, timestamps: true }
);

const Appointment = mongoose.model("Appointment", AppointmentSchema);

module.exports = Appointment;
