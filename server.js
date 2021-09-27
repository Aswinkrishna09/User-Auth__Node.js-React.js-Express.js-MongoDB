const express = require("express");
const connectDB = require("./config/connectDB");
const path = require("path");
const app = express();

connectDB();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
//app.use("/admin", require("./routes/admin"));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Application." });
});

// set port, listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
