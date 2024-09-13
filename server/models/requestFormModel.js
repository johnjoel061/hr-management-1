const mongoose = require("mongoose");

const requestFormSchema = new mongoose.Schema(
    {
        firstName: { type: String,  },
        lastName: { type: String,  },
        middleName: { type: String },
        suffix: { type: String,  default: 'NONE' },
        dateOfBirth: { type: String },
        gmail: { type: String,  },
        position: { type: String,  },
        department: { type: String,  },
        employmentType: { type: String,  },
        certificationType: { type: String, },
        dateRequested: { type: Date, default: Date.now },
        dateFrom: {type: String},
        dateTo: {type: String},
        salaryOption: { type: String, default: 'N/A' },
        purpose: { type: String,  },
        fileUrl: {type: String},
        rejectReason: {type: String},
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        },
    },

    { versionKey: false, timestamps: true }
);

const RequestForm = mongoose.model('RequestForm', requestFormSchema);

module.exports = RequestForm;

