const mongoose = require("mongoose");
const dotenv = require("dotenv");

const connectDB = () => {
  mongoose.connect(process.env.DATABASE).then((con) => {
    console.log("Successfully connected to database database");
    console.log(`Connection String: ${process.env.DATABASE}`);
  });
};

module.exports = connectDB;
