const RequestForm = require("../models/requestFormModel");
const upload = require("../utils/requestFormMulterConfig"); // Adjust the path as needed
const createError = require("../utils/appError");
const nodemailer = require("nodemailer");
const path = require("path"); // Importing the path module
const fs = require("fs");

exports.addRequestForm = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      middleName,
      suffix,
      dateOfBirth,
      gmail,
      position,
      department,
      employmentType,
      certificationType,
      dateFrom, 
      dateTo,
      salaryOption,
      purpose,
    } = req.body;

    // Check if the user already has a pending form request
    // const existingRequestForm =
    //   await RequestForm.findOne({
    //     gmail: gmail,
    //     status: "pending",
    //   });

    // if (existingRequestForm) {
    //   return res.status(400).json({
    //     message: "You already have a pending request certification.",
    //   });
    // }

    // Create a new leave request
    const newRequestForm = new RequestForm({
      firstName,
      lastName,
      middleName,
      suffix,
      dateOfBirth,
      gmail,
      position,
      department,
      employmentType,
      certificationType,
      dateRequested: new Date(),
      salaryOption,
      dateFrom, 
      dateTo,
      purpose,
      status: "pending",
    });
    // Save the leave request to the database
    await newRequestForm.save();
    res.status(201).json({
      message: "request certification submitted successfully",
      requestForm: newRequestForm,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error submitting request certification", error });
  }
};

exports.deleteRequestForm = async (req, res, next) => {
  try {
    const { requestFormId } = req.params;

    // Find the leave request by ID and delete it
    const requestForm =
      await RequestForm.findByIdAndDelete(
        requestFormId
      );

    if (!requestForm) {
      return next(new createError("request certification not found", 404));
    }

    // Get the file path from the document
    const filePath = requestForm.fileUrl;

    // Delete the employment certification from the database
    await RequestForm.findByIdAndDelete(requestFormId);

    // Check if the file exists and delete it
    if (filePath) {
      const absoluteFilePath = path.resolve(filePath);
      fs.unlink(absoluteFilePath, (err) => {
        if (err) {
          console.error(`Error deleting file: ${err.message}`);
        }
      });
    }

    res.status(200).json({
      message: "request certification deleted successfully",
      requestForm,
    });
  } catch (error) {
    console.error(error);
    next(new createError("Error deleting request certification", 500));
  }
};

exports.getAllRequestForm = async (req, res, next) => {
  try {
    // Fetch all leave requests from the database
    const requestForm = await RequestForm.find();

    // Send the leave requests as a JSON response
    res.status(200).json({
      message: "request certification fetched successfully",
      requestForm,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching request certification", error });
  }
};


// Helper function to send emails
const sendEmail = async (to, subject, text, attachments = []) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.LGU_GMAIL,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.LGU_GMAIL,
    to,
    subject,
    text,
    attachments,
  };

  await transporter.sendMail(mailOptions);
};
//APPROVE CERTIFICATION OR REJECTED
exports.approveRequestForm = async (req, res, next) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ message: err });
    }

    try {
      const { certificationId, rejectReason } = req.body;

      // Find the pending employment certification request by ID
      const requestForm = await RequestForm.findById(certificationId);

      if (!requestForm) {
        return res.status(404).json({
          message: "Certification request not found.",
        });
      }

      if (requestForm.status !== "pending") {
        return res.status(400).json({
          message: "This certification request is not pending.",
        });
      }

      if (rejectReason) {
        // Handle rejection
        await sendEmail(
          requestForm.gmail,
          "Requested Certification Rejected",
          `Dear ${requestForm.firstName} ${requestForm.lastName},\n\n` +
          `We regret to inform you that your request for certification has been rejected.\n\n` +
          `Reason for rejection: ${rejectReason}\n\n` +
          `If you have any questions or would like further clarification, please don't hesitate to contact us.\n\n` +
          `Thank you for your understanding.\n\n` +
          `Best regards,\n` +
          `The HR Team\n` +
          `Local Government Unit`
        );

        // Update the status to rejected
        requestForm.status = "rejected";
        requestForm.rejectReason = rejectReason;
        await requestForm.save();

        return res.status(200).json({
          message: "Requested certification rejected and reason sent via email.",
          requestForm,
        });
      }

      // Ensure the file was uploaded successfully
      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded. Please upload a document.",
        });
      }

      const fileUrl = path.join('uploads', 'request_forms', req.file.filename);

      // Send the requested file to the employee via email
      await sendEmail(
        requestForm.gmail,
        "Requested Certification",
        `Dear ${requestForm.firstName} ${requestForm.lastName},\n\n` +
        `We are pleased to inform you that your requested certification is ready. Please find the document attached here in your email.\n\n` +
        `If you require any further assistance or have any questions, feel free to contact us.\n\n` +
        `Best regards,\n` +
        `The HR Team\n` +
        `Local Government Unit`,
        [{
          filename: req.file.originalname,
          path: path.join(__dirname, "..", fileUrl),
        }]
      );

      // Update the status to approved
      requestForm.status = "approved";
      requestForm.dateApproved = new Date();
      requestForm.fileUrl = fileUrl;
      await requestForm.save();

      res.status(200).json({
        message: "Requested certification approved and file sent successfully.",
        requestForm,
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error processing requested certification request.",
        error,
      });
    }
  });
};