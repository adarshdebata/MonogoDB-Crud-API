const connectDB = require("../configs/dbConfig")

const getTaskCollection = async () => {
    const db = await connectDB();
    return db.collection('tasks');
}

module.exports = {getTaskCollection}