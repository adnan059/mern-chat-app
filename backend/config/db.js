const mongoose = require("mongoose");

const connectDB = async (req, res, next) => {
  try {
    const conn = await mongoose.connect(process.env.DB_URL);
    console.log("Database Connected: " + conn.connection.host);
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

module.exports = connectDB;
