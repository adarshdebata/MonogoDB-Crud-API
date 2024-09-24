const express = require('express');
const { updateTask } = require('../controllers/taskController');
const router = express.Router();

router.put('/:id', updateTask);

module.exports = router;
