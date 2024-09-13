const express = require("express");
const requestFormController = require("../controllers/requestFormController");

const router = express.Router();

// Route to add a new employment certification request
router.post("/certification/add", requestFormController.addRequestForm);

// Route to delete an employment certification request
router.delete("/certification/delete/:requestFormId", requestFormController.deleteRequestForm);

// Route to get all employment certification requests
router.get("/certification/getAll", requestFormController.getAllRequestForm);

// Route to approve an employment certification request
router.post("/certification/approve", requestFormController.approveRequestForm);

module.exports = router;
