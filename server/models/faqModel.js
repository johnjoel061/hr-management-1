const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
    {
        faq: { type: String },
        faqAnswer: { type: String },
    },

    { versionKey: false, timestamps: true }
);

const Department = mongoose.model('Faq', faqSchema);

module.exports = Department;