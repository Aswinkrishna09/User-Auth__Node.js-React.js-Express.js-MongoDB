const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://aswin_krishna:Portal_33@test.iahyn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
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
