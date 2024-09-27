const express = require('express');
const { readTask } = require('../controllers/taskController');
const router = express.Router();

router.get('/get', readTask);

module.exports = router;
