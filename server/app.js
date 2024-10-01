const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const fs = require('fs');
const cors = require("cors");
const app = express();

//===== ROUTERS ====//
const authRouter = require('./routes/authRoute');
const userRouter = require('./routes/userRoute');
const eligibilityRouter = require('./routes/eligibilityRoute');
const departmentRouter = require('./routes/departmentRoute');
const leaveTypeRouter = require('./routes/leaveTypeRoute');
const personalDataSheetRouter = require('./routes/personalDataSheetRoute');
const appointmentRouter = require('./routes/appointmentRoute');
const assumptionOfDutyRouter = require('./routes/assumptionOfDutyRoute');
const oathOfOfficeRouter = require('./routes/oathOfOfficeRoute');
const PositionDescriptionFormRouter = require('./routes/positionDescriptionForm');
const certificateOfEligibilityRouter = require('./routes/certificateOfEligibilityRoute');
const designationRouter = require('./routes/designationRoute');
const salnRouter = require('./routes/salnRoute');
const nosiRouter = require('./routes/nosiRoute');
const medicalCertificateRouter = require('./routes/medicalCertificateRoute');
const nbiClearanceRouter = require('./routes/nbiClearanceRoute');
const torRouter = require('./routes/torRoute');
const birthCertificateRouter = require('./routes/birthCertificateRoute');
const marriageContractRouter = require('./routes/marriageContractRoute');
const certOfLeaveBalanceRouter = require('./routes/certOfLeaveBalanceRoute');

const clearanceMoneyPropertyAcctRouter = require('./routes/clearanceMoneyPropertyAcctRoute');
const cosRouter = require('./routes/cosRoute');
const commendationAndAwardRouter = require('./routes/commendationAndAwardRoute');
const copiesOfDiscipActionRouter = require('./routes/copiesOfDiscipActionRoute');

const learningDevelopmentRouter = require('./routes/learningDevelopmentRoute');
const leaveRecordRouter = require('./routes/leaveRecordRoute');
const serviceRecordRouter = require('./routes/serviceRecordRoute');
const performanceRatingRouter = require('./routes/performanceRatingRoute');

const faqRouter = require('./routes/faqRoute');
const privacyPolicyRouter = require('./routes/privacyPolicyRoute');
const calendarRouter = require('./routes/calendarRoute');
const orgStructureRouter = require('./routes/orgStructureRoute');
const settingsRouter = require('./routes/settingsRoute');
const leaveRequestRouter = require('./routes/leaveRequestRoute');

const requestFormRouter = require('./routes/requestFormRoute');
const awardRouter = require('./routes/awardRoute');


//===== ENVIRONMENT VARIABLES ====//
dotenv.config({ path: path.join(__dirname, "./.env") });

//===== DATABASE CONFIGURATION ====//
const connectDB = require("./confiq/db");

//===== MIDDLEWARE ====//
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

//===== DATABASE CONNECTION ====//
const MONGODB_CONNECTION_URL = process.env.MONGODB_CONNECTION_URL;
const DB_OPTIONS = {
  user: process.env.MONGODB_DATABASE_USERNAME,
  pass: process.env.MONGODB_DATABASE_PASSWORD,
  dbName: process.env.MONGODB_DATABASE_NAME,
  autoIndex: true,
};

// Debugging: Log DB_OPTIONS to ensure they are correctly set
console.log("DB_OPTIONS:", DB_OPTIONS);

// Connect to the database
connectDB(MONGODB_CONNECTION_URL, DB_OPTIONS);

//===== ROUTING IMPLEMENTATION ====//
app.use("/api/auth", authRouter);
app.use("/api/employee", userRouter);
app.use("/api/eligibility", eligibilityRouter);
app.use("/api/department", departmentRouter);
app.use("/api/leave-type", leaveTypeRouter);
app.use("/api/personal-data-sheet", personalDataSheetRouter); 
app.use("/api/appointment", appointmentRouter); 
app.use("/api/assumption-of-duty", assumptionOfDutyRouter);
app.use("/api/oath-of-office", oathOfOfficeRouter); 
app.use("/api/position-description-form", PositionDescriptionFormRouter); 
app.use("/api/certificate-of-eligibility", certificateOfEligibilityRouter); 
app.use("/api/designation", designationRouter);
app.use("/api/saln", salnRouter);
app.use("/api/nosi", nosiRouter);
app.use("/api/medical-certificate", medicalCertificateRouter);
app.use("/api/nbi-clearance", nbiClearanceRouter);
app.use("/api/tor", torRouter);
app.use("/api/birth-certificate", birthCertificateRouter); 
app.use("/api/marriage-contract", marriageContractRouter);
app.use("/api/certificate-of-leave-balance", certOfLeaveBalanceRouter);

app.use("/api/clearance-from-money-and-property-accountabilities", clearanceMoneyPropertyAcctRouter);
app.use("/api/contract-of-service", cosRouter);
app.use("/api/commendations-and-awards", commendationAndAwardRouter);
app.use("/api/copies-of-disciplinary-actions", copiesOfDiscipActionRouter);

app.use("/api/employee/learning-development", learningDevelopmentRouter); 
app.use("/api/employee/leave-record", leaveRecordRouter);
app.use("/api/employee/service-record", serviceRecordRouter);
app.use("/api/employee/performance-rating", performanceRatingRouter);
app.use("/api/employee/awards", awardRouter);

app.use("/api/faqs", faqRouter); 
app.use("/api/privacy-policy", privacyPolicyRouter); 
app.use("/api/calendar", calendarRouter); 
app.use("/api/organizational-structure", orgStructureRouter); 
app.use("/api/settings", settingsRouter); 
app.use("/api/employee", leaveRequestRouter); 
app.use("/api/request-form", requestFormRouter); 

// Middleware to force HTTPS
app.use((req, res, next) => {
  if (req.secure || req.get('x-forwarded-proto') === 'https') {
    return next();
  } else {
    res.redirect(`https://${req.get('host')}${req.url}`);
  }
});

//===== STATIC FILES SETUP ====//
// Define the upload directory for profile pictures
const uploadDir = path.join(__dirname, 'uploads', 'profilePictures');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Define the upload directory for signatures
const uploadSig = path.join(__dirname, 'uploads', 'signatures');
if (!fs.existsSync(uploadSig)) {
  fs.mkdirSync(uploadSig, { recursive: true });
}

const uploadLguLogo = path.join(__dirname, 'uploads', 'settings');
if (!fs.existsSync(uploadLguLogo)) {
  fs.mkdirSync(uploadLguLogo, { recursive: true });
}

app.use('/uploads/profilePictures', express.static(uploadDir));
app.use('/uploads/signatures', express.static(uploadSig));
app.use('/uploads/settings', express.static(uploadLguLogo));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//===== GLOBAL ERROR HANDLER ====//
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

// Serve static files from the 'public' directory
app.use("/", express.static(path.join(__dirname, "public")));

// Serve Vite app files in development
if (process.env.NODE_ENV === "development") {
  // Use the Vite dev server URL to proxy API requests
  app.use((req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      next(); // Let API requests go through
    } else {
      // For all other requests, send to Vite
      const viteDevServerURL = 'https://hr-management-1-baxp.onrender.com'; // Default Vite port
      res.redirect(viteDevServerURL + req.originalUrl);
    }
  });
}

// Handle 404 errors
app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ message: "404 Not Found" });
  } else {
    res.json({ message: '404 Not Found' });
  }
});

module.exports = app;
