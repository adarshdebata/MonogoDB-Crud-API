const express = require('express');
const { updateTask } = require('../controllers/taskController');
const router = express.Router();

router.put('/update/:id', updateTask);

module.exports = router;
