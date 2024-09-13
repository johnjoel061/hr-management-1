const express = require('express');
const router = express.Router();
const NosiController = require('../controllers/nosiController');

router.post('/add', NosiController.addNosi);
router.get("/all", NosiController.getAllNosi);
router.get("/:id", NosiController.getNosiById);
router.put("/:id", NosiController.updateNosiById);
router.delete("/:id", NosiController.deleteNosiById);

module.exports = router;