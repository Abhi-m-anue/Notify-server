const express = require("express");
const router = express.Router();

const {getAllMonitors, createMonitor, editMonitor, deleteMonitor} = require('../controllers/monitors')

router.route('/').get(getAllMonitors).post(createMonitor);
router.route('/:id').patch(editMonitor).delete(deleteMonitor);

module.exports = router