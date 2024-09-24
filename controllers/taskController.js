const taskService = require("../Services/taskService");
const { ObjectId } = require('mongodb');

const createTask = async (req, res) => {
    try {
        const task = req.body;
        const newTask = await taskService.createTask(task);
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const readTask = async (req, res) => {
    try {
        const task = await taskService.getTask();
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateTask = async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const updatedTask = req.body;
        const success = await taskService.updateTask(id, updatedTask);
        if (success) {
            res.status(200).json({ message: "Task updated successfully" });
        } else {
            res.status(404).json({ message: "Task not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const success = await taskService.deleteTask(id);
        if (success) {
            res.status(200).json({ message: 'Task Deleted Sucessfully' })
        } else {
            res.status(404).json({ message: 'Task Not Found' })
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { createTask, readTask, updateTask, deleteTask };
