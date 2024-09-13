const express = require('express');
const router = express.Router();
const DesignationController = require('../controllers/designationController');

router.post('/add', DesignationController.addDesignation);
router.get("/all", DesignationController.getAllDesignation);
router.get("/:id", DesignationController.getDesignationById);
router.put("/:id", DesignationController.updateDesignationById);
router.delete("/:id", DesignationController.deleteDesignationById);

module.exports = router;