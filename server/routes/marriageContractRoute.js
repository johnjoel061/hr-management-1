const express = require('express');
const router = express.Router();
const MarriageContractController = require('../controllers/marriageContractController');

router.post('/add', MarriageContractController.addMarriageContract);
router.get("/all", MarriageContractController.getAllMarriageContract);
router.get("/:id", MarriageContractController.getMarriageContractById);
router.put("/:id", MarriageContractController.updateMarriageContractById);
router.delete("/:id", MarriageContractController.deleteMarriageContractById);

module.exports = router;

