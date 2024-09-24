const { getTaskCollection } = require("../models/taskModel");
const { ObjectId } = require('mongodb');

const createTask = async (tasks) => {
    const collection = await getTaskCollection();
    const result = await collection.insertOne(tasks);
    return{ _id: result.insertedId, ...tasks };
};

const getTask = async () => {
    const collection = await getTaskCollection();
    return await collection.find().toArray();
};
const updateTask = async (id, updatedTask) => {
    const collection = await getTaskCollection();
    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: updatedTask });
    return result.modifiedCount > 0;
};

const deleteTask = async (id) => {
    const collection = await getTaskCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
};

module.exports = { createTask, getTask, updateTask, deleteTask };
