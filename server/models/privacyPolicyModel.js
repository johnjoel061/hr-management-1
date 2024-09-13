const mongoose = require("mongoose");

const privacyPolicySchema = new mongoose.Schema(
    {
        privacyTitle: { type: String },
        privacyDescription: { type: String },
    },

    { versionKey: false, timestamps: true }
);

const PrivacyPolicy = mongoose.model('PrivacyPolicy', privacyPolicySchema);

module.exports = PrivacyPolicy;