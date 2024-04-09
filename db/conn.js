const mongoose = require("mongoose");
// const User = require("../models/user.model.js");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO);
    console.log(`MongoDB Connected : ${conn.connection.host}`);
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};
module.exports = connectDB;
