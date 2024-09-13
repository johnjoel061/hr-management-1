const express = require('express');
const router = express.Router();
const CosCotroller = require('../controllers/cosCotroller');

router.post('/add', CosCotroller.addCos);
router.get("/all", CosCotroller.getAllCos);
router.get("/:id", CosCotroller.getCosById);
router.put("/:id", CosCotroller.updateCosById);
router.delete("/:id", CosCotroller.deleteCosById);

module.exports = router;