const express = require('express');
const router = express.Router();
const TorController = require('../controllers/torController');

router.post('/add', TorController.addTor);
router.get("/all", TorController.getAllTor);
router.get("/:id", TorController.getTorById);
router.put("/:id", TorController.updateTorById);
router.delete("/:id", TorController.deleteTorById);

module.exports = router;