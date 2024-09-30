const express = require("express");
const createRoute = require("./routes/createRoute");
const readRoute = require("./routes/readRoute");
const updateRoute = require("./routes/updateRoute");
const deleteRoute = require("./routes/deleteRoute");
const connectDB = require("./configs/dbConfig");

require("dotenv").config();

const app = express();

//server Port
const PORT = process.env.PORT || 3000;

app.use(express.json());

//middlewares

// Routes

app.use("/tasks", createRoute);
app.use("/tasks", readRoute);
app.use("/tasks", updateRoute);
app.use("/tasks", deleteRoute);

connectDB();

app.listen(PORT, () => {
  console.log("Server is running on port : ", PORT);
});

module.exports = app;
