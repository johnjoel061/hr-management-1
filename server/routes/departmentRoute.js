const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');

router.post('/add', departmentController.addDepartment);
router.get("/all", departmentController.getAllDepartment);
router.get("/:id", departmentController.getDepartmentById);
router.put("/:id", departmentController.updateDepartmentById);
router.delete("/:id", departmentController.deleteDepartmentById);

module.exports = router;