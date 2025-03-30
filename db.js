const mongoose = require("mongoose");
const dotenv = require("dotenv");

const connectDB = () => {
  mongoose.connect(process.env.DATABASE).then((con) => {
    console.log("Successfully connected to database");
  });
};

module.exports = connectDB;
