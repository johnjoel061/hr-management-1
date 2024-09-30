const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AwardSchema = new Schema({
  nameOfAward: { type: String },
  levelOfAward: { type: String },
  dateOfAward: { type: String },
  issuedBy: { type: String },
},
    { versionKey: false, timestamps: true }
);

module.exports = AwardSchema;
