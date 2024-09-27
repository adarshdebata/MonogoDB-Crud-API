const express = require('express');
const { deleteTask } = require('../controllers/taskController');
const router = express.Router();

router.delete('/delete/:id', deleteTask);

module.exports = router;
