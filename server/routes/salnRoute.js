const express = require('express');
const router = express.Router();
const SalnController = require('../controllers/salnController');

router.post('/add', SalnController.addSaln);
router.get("/all", SalnController.getAllSaln);
router.get("/:id", SalnController.getSalnById);
router.put("/:id", SalnController.updateSalnById);
router.delete("/:id", SalnController.deleteSalnById);

module.exports = router;