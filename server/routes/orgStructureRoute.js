const express = require('express');
const router = express.Router();
const OrgStructureController = require('../controllers/orgStructureController');

router.post('/add', OrgStructureController.addOrgStructure);
router.get("/all", OrgStructureController.getAllOrgStructure);
router.get("/:id", OrgStructureController.getOrgStructureById);
router.put("/:id", OrgStructureController.updateOrgStructureById);
router.delete("/:id", OrgStructureController.deleteOrgStructureById);

module.exports = router;