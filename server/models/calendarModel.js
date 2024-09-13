const mongoose = require("mongoose");

const CalendarSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    allDay: {
      type: Boolean,
      default: false,
    },
  },

  { versionKey: false, timestamps: true }
);

const Calendar = mongoose.model("Calendar", CalendarSchema);

module.exports = Calendar;
