const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/userapp", {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
    });
    console.log("MongoDB connected...");
  } catch (err) {
    console.log(err.message);
    //Exit process with  failure
    process.exit(1);
  }
};

module.exports = connectDB;
