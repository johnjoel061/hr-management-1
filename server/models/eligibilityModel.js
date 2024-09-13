const mongoose = require("mongoose");

const eligibilitySchema = new mongoose.Schema(
    {
        eligibilityTitle: { type: String },
    },

    { versionKey: false, timestamps: true }
);

const Eligibility = mongoose.model('Eligibility', eligibilitySchema);

module.exports = Eligibility;