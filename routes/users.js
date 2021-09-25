const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect("/users/login");
  }
};

router.get("/", verifyLogin, async (req, res) => {
  if (req.session.updataUser) {
    let error = req.session.passMissMatch
      ? "password miss match"
      : "success";
    req.session.updataUser = false;
    res.render("user/details", { user: req.session.user, error });
    return;
  }
  res.render("user/details", { user: req.session.user });
  //res.send(req.session.user)
});

router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    return res.redirect("/users/");
  }
  res.render("user/login");
});

router.post("/login", async (req, res) => {
  console.log(req.body);
  // check if user exist or not
  const { email, password } = req.body;

  try {
    if (req.session.loggedIn) {
      return res.redirect("/users/");
    }
    let user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.render("user/login", { error: "Invalid Credentials" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log("no match");
      return res.render("user/login", { error: "Invalid Credentials" });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    res.redirect("/users/");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/logout", (req, res) => {
  req.session.loggedIn=false
  res.redirect("/users/");
});

router.post("/delete-account",verifyLogin, async (req, res) => {
  try {
    await User.findOneAndRemove({ user: req.session.user.id });
    req.session.destroy();
    res.redirect("/users/");
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/create-user", (req, res) => {
  res.render("user/create-user");
});

router.post("/create-user", async (req, res) => {
  console.log(req.body);
  // check if user exist or not
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    console.log(user);
    if (user) {
      return res.render("user/create-user", { registerErr: true });
    }
    user = new User({
      name,
      email,
      password,
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save(); 
    res.redirect("/users/login");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/update-user", verifyLogin, async (req, res) => {
  res.render("user/details", { user: req.session.user });
  //res.send(req.session.user)
});

router.post("/update-user", verifyLogin, async (req, res) => {
  const userEmail = req.session.user.email;
  const { name, email, age, place, password, newpassword } = req.body;
  const salt = await bcrypt.genSalt(10);
  const confirm = await bcrypt.hash(password, salt);
  const isTrue = await User.findOne({ userEmail, confirm });
  if (!isTrue) {
    req.session.passMissMatch = true;
    return res.redirect("/users/");
  }
  req.session.passMissMatch = false;
  let userFields = {};
  if (name) userFields.name = name;
  if (age) userFields.age = age;
  if (place) userFields.place = place;
  const setpassword = await bcrypt.hash(password, salt);
  if (password) userFields.password = setpassword;
  try {
    let user = await User.findOne({ user: req.session.user._id });
    ///update
    if (user) {
      user = await User.findOneAndUpdate(
        { user: req.session.user.id },
        { $set: { ...userFields } },
        { new: true }
      );
      //  console.log(profile)
      await user.save();
      console.log(user);
      req.session.updataUser = true;
      req.session.user = user;
      res.redirect("/users");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
