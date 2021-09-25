const express = require("express");
const createError = require("http-errors");
const connectDB = require("./config/connectDB");
const path = require("path");
const app = express();
const session = require("express-session");
const hbs = require("express-handlebars");
connectDB();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "key", cookie: { maxAge: 6000000 } }));

app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layout/",
    partialsDir: __dirname + "/views/partials/",
  })
);
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "hbs");

//Define Routes
app.use("/users", require("./routes/users"));
//app.use("/admin", require("./routes/admin"));
// simple route
app.get("/", (req, res) => {
  res.render("landing/landing");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// set port, listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
