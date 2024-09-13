const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");
const url = require("url");
const LeaveRequest = require("../models/leaveRequestModel");
const LeaveType = require("../models/leaveTypeModel");

const generateLeaveRequestPDF = async (req, res) => {
  try {
    const { _id } = req.params;
    // Fetch leave request data from the database
    const leaveRequest = await LeaveRequest.findById(_id);

    const leaveTypes = await LeaveType.find({});

    if (!leaveRequest) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    // Create a new PDF document
    const doc = new PDFDocument({
      size: "A4", // Size as in the original form
      margins: { top: 50, left: 50, right: 50, bottom: 50 },
    });

    // Set the response headers to trigger download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=leave_request_${leaveRequest.lastName}.pdf`
    );

    // Pipe the PDF into the response
    doc.pipe(res);
    // Set the font size and style
    doc
      .font("Helvetica-BoldOblique")
      .fontSize(7)
      .text("CS Form No. 6", { align: "left" });
    doc
      .font("Helvetica-BoldOblique")
      .fontSize(7)
      .text("Revised 2020", { align: "left" });
    doc.moveDown();
    // Add the static logo image to the PDF
    const logoPath = path.join(__dirname, "../assets/LGU-LOGO.jpg"); // Adjust the path as needed
    doc.image(logoPath, {
      fit: [45, 45], // Adjust size as needed
      align: "left", // Alignment of the image
      valign: "top", // Vertical alignment of the image
      x: 160, // X position in pixels
    });

    doc
      .font("Helvetica")
      .fontSize(7)
      .text("Stamp of Date Receipt", { align: "right" }),
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .text("Republic of the Philippines", { align: "center" });
    doc
      .font("Helvetica-Bold")
      .fontSize(8)
      .text("Local Government Unit", { align: "center" });
    doc
      .font("Helvetica-BoldOblique")
      .fontSize(8)
      .text("Aroroy, Masbate", { align: "center" });

    doc.moveDown();
    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .text("APPLICATION FOR LEAVE", { align: "center" });
    doc.moveDown();

    // Draw border for the application form
    doc.rect(47, 135, 500, 32).stroke();
    // 1. Office/Department, Name, Date of Filing, Position, and Salary
    doc
      .font("Helvetica")
      .fontSize(9)
      .text(`1. OFFICE/DEPARTMENT: ${leaveRequest.department}`);
    doc
      .font("Helvetica")
      .fontSize(9)
      .text(
        `2. NAME:    ${leaveRequest.lastName},    ${leaveRequest.firstName},     ${leaveRequest.middleName}`,
        320,
        145
      );
    doc
      .font("Helvetica")
      .fontSize(7)
      .text(`(Last)             (First)                 (Middle)`, 378, 155);

    doc.rect(47, 167, 500, 24).stroke();
    doc
      .font("Helvetica")
      .fontSize(9)
      .text(
        `3. DATE OF FILING: ${new Date(
          leaveRequest.dateOfFiling
        ).toLocaleDateString()}`,
        50,
        175
      );
    doc.text(`4. POSITION:    ${leaveRequest.position}`, 230, 175);
    doc.text(`5. Salary:    ${leaveRequest.salary}`, 420, 175);
    doc.moveDown();

    doc.rect(47, 191, 500, 15).stroke();
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .text(`6. DETAILS OF APPLICATION`, 230, 195);
    doc.moveDown();

    // 6. Type of Leave to be Availed Of
    doc.rect(47, 206, 277, 235).stroke();
    doc
      .font("Helvetica")
      .fontSize(9)
      .text(`6.A TYPE OF LEAVE TO BE AVAILED OF`, 50, 212);
    doc.moveDown();

    let currentY = doc.y;
    leaveTypes.forEach((type) => {
      const isChecked =
        leaveRequest.leaveType === type.leaveType ? "[/]" : "[ ]";
      doc
        .font("Helvetica")
        .fontSize(6.7)
        .text(`${isChecked} ${type.leaveType}`, {
          continued: false, // Makes sure it doesn't break into the next line
        });
      currentY += 12.5; // Adjust this value for custom spacing
      doc.y = currentY; // Set the Y position for the next item
    });
    doc.moveDown();

    doc.rect(324, 206, 223, 235).stroke();
    if (leaveRequest.otherLeaveType) {
      doc.fontSize(7).text(`Others:   ${leaveRequest.otherLeaveType}`);
      doc.text(`___________________________________`, 73, 405);
    }
    doc.moveDown();

    //====================6.B DETAILS OF LEAVE========================================================================================
    doc.font("Helvetica").fontSize(9).text("6.B DETAILS OF LEAVE", 330, 212);

    // Vacation/Special Privilege Leave
    const vacationSpecialPrivilegeLeave = {
      "Within the Philippines": "Within the Philippines",
      Abroad: "Abroad",
    };
    const paddingBottom = 12;
    doc
      .font("Helvetica-Oblique")
      .fontSize(7.8)
      .text("Incase of Vacation/Special Privilege Leave:", 330, 233);
    doc.text("", 330, 233 + paddingBottom);
    Object.keys(vacationSpecialPrivilegeLeave).forEach((type) => {
      const isChecked =
        leaveRequest.vacationSpecialLeave === type ? "[/]" : "[ ]";
      const address =
        leaveRequest.vacationSpecialLeave === type &&
        leaveRequest.vacationSpecialLeaveAddress
          ? `${leaveRequest.vacationSpecialLeaveAddress}`
          : " _____________________";
      // Combine the leave type and address into one line
      doc
        .font("Helvetica")
        .fontSize(7.7)
        .text(
          `${isChecked} ${vacationSpecialPrivilegeLeave[type]}(Specify):  ${address}`
        );
    });
    doc.moveDown();

    // Vacation/Special Privilege Leave
    const sickLeaves = {
      "In Hospital": "In Hospital",
      "Out Patient": "Out Patient",
    };

    doc
      .font("Helvetica-Oblique")
      .fontSize(7.8)
      .text("Incase of Sick Leave:", 330, 274);
    doc.text("", 330, 274 + paddingBottom);
    Object.keys(sickLeaves).forEach((type) => {
      const isChecked = leaveRequest.sickLeave === type ? "[/]" : "[ ]";
      const illness =
        leaveRequest.sickLeave === type && leaveRequest.sickLeaveIllness
          ? `${leaveRequest.sickLeaveIllness}`
          : " _______________________";
      // Combine the leave type and address into one line
      doc
        .font("Helvetica")
        .fontSize(7.7)
        .text(`${isChecked} ${sickLeaves[type]}(Specify Illness):  ${illness}`);
    });
    doc.moveDown();

    doc
      .font("Helvetica-Oblique")
      .fontSize(7.8)
      .text("Incase of Special Leave Benefits for Women:", 330, 320);
    doc
      .font("Helvetica")
      .fontSize(7.8)
      .text(
        `(Specify Illness)   ${leaveRequest.womanSpecialLeave || ""}`,
        330,
        332
      );
    doc
      .font("Helvetica")
      .fontSize(7.8)
      .text("___________________________________", 387, 334);
    doc.moveDown();

    const studyLeaves = {
      "Completion of Master's Degree": "Completion of Master's Degree",
      "BAR/Board Examination Review": "BAR/Board Examination Review",
    };
    doc
      .font("Helvetica-Oblique")
      .fontSize(7.8)
      .text("Incase of Study Leave:", 330, 360);
    doc.text("", 330, 360 + paddingBottom);
    Object.keys(studyLeaves).forEach((type) => {
      const isChecked = leaveRequest.studyLeave === type ? "[/]" : "[ ]";
      doc
        .font("Helvetica")
        .fontSize(7.7)
        .text(`${isChecked} ${studyLeaves[type]}`);
    });
    doc.moveDown();

    const others = {
      "Monetization of Leave Credits": "Monetization of Leave Credits",
      "Terminal Leave": "Terminal Leave",
    };
    doc
      .font("Helvetica-Oblique")
      .fontSize(7.8)
      .text("Other Purpose:", 330, 405);
    doc.text("", 330, 405 + paddingBottom);
    Object.keys(others).forEach((type) => {
      const isChecked = leaveRequest.otherPurpose === type ? "[/]" : "[ ]";
      doc.font("Helvetica").fontSize(7.7).text(`${isChecked} ${others[type]}`);
    });
    doc.moveDown();

    doc.rect(47, 441, 277, 80).stroke();
    doc
      .font("Helvetica")
      .fontSize(9)
      .text(`6.C NUMBER OF WORKING DAYS APPLIED FOR`, 50, 448);
    doc
      .font("Helvetica-Bold")
      .fontSize(8.5)
      .text(`${leaveRequest.numberOfWorkDays} Days`, 150, 463);
    doc
      .font("Helvetica")
      .fontSize(9)
      .text(`_______________________________________`, 65, 465);
    doc.font("Helvetica").fontSize(9).text(`INCLUSIVE DATES`, 65, 480);
    doc
      .font("Helvetica-Bold")
      .fontSize(8.5)
      .text(
        `${new Date(leaveRequest.startDate).toLocaleDateString(
          "en-US"
        )} - ${new Date(leaveRequest.endDate).toLocaleDateString("en-US")}`,
        125,
        493
      );
    doc
      .font("Helvetica")
      .fontSize(9)
      .text(`_______________________________________`, 65, 496);

    doc.rect(324, 441, 223, 80).stroke();
    doc.font("Helvetica").fontSize(9).text(`6.D COMMUTATION`, 330, 448);
    const commutations = {
      "Not Requested": "Not Requested",
      Requested: "Requested",
    };
    doc.text("", 330, 450 + paddingBottom);
    Object.keys(commutations).forEach((type) => {
      const isChecked = leaveRequest.commutation === type ? "[/]" : "[ ]";
      doc
        .font("Helvetica")
        .fontSize(7.7)
        .text(`${isChecked} ${commutations[type]}`);
    });

    // Modify the signature path to use only the filename, not the full URL
    // Signature
    // Signature handling
    const signatureUrl = leaveRequest.signature; // This is a URL

    if (signatureUrl) {
      const parsedUrl = url.parse(signatureUrl);
      const signatureFilename = path.basename(parsedUrl.pathname); // Extract filename from URL
      const signaturePath = path.join(
        __dirname,
        "../uploads/signatures",
        signatureFilename
      );

      // Check if the file exists before attempting to use it
      if (fs.existsSync(signaturePath)) {
        try {
          doc.image(signaturePath, 400, 460, { width: 120, height: 50 });
          doc
            .font("Helvetica")
            .fontSize(9)
            .text(`_______________________________________`, 350, 496);
          doc
            .font("Helvetica")
            .fontSize(7.5)
            .text(`(Signature of the Applicant)`, 400, 507);
        } catch (error) {
          console.error("Error adding signature image:", error);
          doc
            .font("Helvetica")
            .fontSize(9)
            .text("Signature not available", 350, 496);
        }
      } else {
        doc
          .font("Helvetica")
          .fontSize(9)
          .text("Signature not available", 350, 496);
      }
    } else {
      // Handle the case where signatureUrl is empty, null, or undefined
      doc
        .font("Helvetica")
        .fontSize(9)
        .text("Signature not available", 350, 496);
    }

    //=============================================================================================================================

    //==============================DETAILS OF LEAVE==================================================================================
    doc.rect(47, 521, 500, 15).stroke();
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("7. DETAILS OF ACTION ON APPLICATION", 200, 525);

    doc.rect(47, 536, 277, 150).stroke();
    doc
      .font("Helvetica")
      .fontSize(9)
      .text("7.A CERTIFICATION OF LEAVE CREDITS", 50, 543);
    doc.font("Helvetica").fontSize(7.7).text(`As of`, 100, 565);
    doc
      .font("Helvetica")
      .fontSize(9)
      .text(`____________________________`, 120, 565);

    doc.font("Helvetica-Bold").fontSize(7.8).text(`Vacation Leave`, 158, 584);
    doc.font("Helvetica-Bold").fontSize(7.8).text(`Sick Leave`, 250, 584);
    doc
      .font("Helvetica-BoldOblique")
      .fontSize(7.8)
      .text(`Total Earned`, 75, 600);
    doc
      .font("Helvetica-BoldOblique")
      .fontSize(7.8)
      .text(`Less this Application`, 63, 614);
    doc.font("Helvetica-BoldOblique").fontSize(7.8).text(`Balance`, 85, 630);

    //TABLE
    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .text(`__________________________________________________`, 60, 587);
    doc.rect(60, 580, 250, 60).stroke();
    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .text(`__________________________________________________`, 60, 602);
    doc.rect(60, 580, 84, 60).stroke();
    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .text(`__________________________________________________`, 60, 617);
    doc.rect(227, 580, 83, 60).stroke();
    doc
      .font("Helvetica-Bold")
      .fontSize(8.5)
      .text(`JOSELITO M. MALANSALAY, II, MPA`, 108, 659);
    doc
      .font("Helvetica")
      .fontSize(9)
      .text(`_________________________________`, 100, 660);
    doc.font("Helvetica").fontSize(7.5).text(`(Authorized Officer)`, 152, 670);
    //Department Head
    doc.rect(324, 536, 223, 150).stroke();
    doc.font("Helvetica").fontSize(9).text("7.B RECOMMENDATION", 330, 543);
    doc.font("Helvetica").fontSize(7.7).text("[ ] For approval", 330, 560);
    doc
      .font("Helvetica")
      .fontSize(7.7)
      .text(
        "[ ] For disapproval due to_____________________________",
        330,
        572
      );
    doc
      .font("Helvetica")
      .fontSize(9)
      .text("________________________________________", 340, 585);
    doc
      .font("Helvetica")
      .fontSize(9)
      .text("________________________________________", 340, 598);
    doc
      .font("Helvetica")
      .fontSize(9)
      .text("________________________________________", 340, 611);

    doc
      .font("Helvetica")
      .fontSize(9)
      .text(`_________________________________`, 355, 660);
    doc.font("Helvetica").fontSize(7.5).text(`(Department Head)`, 405, 670);

    //Municipal Administrator
    doc.rect(47, 686, 500, 100).stroke();
    doc.font("Helvetica").fontSize(9).text("7.C APPROVED FOR:", 50, 692);
    doc.font("Helvetica").fontSize(9).text("7.D DISAPPROVED DUE TO:", 330, 692);
    doc
      .font("Helvetica")
      .fontSize(9)
      .text(`_____________________________________`, 350, 704);
    doc
      .font("Helvetica")
      .fontSize(9)
      .text(`_____________________________________`, 350, 715);
    doc
      .font("Helvetica")
      .fontSize(9)
      .text(`_____________________________________`, 350, 726);

    doc.font("Helvetica").fontSize(7.7).text("________days with pay", 70, 705);
    doc
      .font("Helvetica")
      .fontSize(7.7)
      .text("________days without pay", 70, 716);
    doc
      .font("Helvetica")
      .fontSize(7.7)
      .text("________others (Specify)", 70, 727);

    doc.font("Helvetica-Bold").fontSize(8.5).text(`FERNEE J. LIM`, 275, 758);
    doc
      .font("Helvetica")
      .fontSize(9)
      .text(`_________________________________`, 220, 760);
    doc
      .font("Helvetica")
      .fontSize(7.5)
      .text(`(Municipal Administrator)`, 263, 770);
    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating PDF", error });
  }
};

module.exports = { generateLeaveRequestPDF };
