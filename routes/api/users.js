const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../../middleware/auth");
//Public Route
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please enter a valid Email").isEmail(),
    check(
      "password",
      "Please Enter a password with 6 or more charater"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    console.log(req.body)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
    // check if user exist or not
    const { name, email, password } = req.body;
  
    try {
      let user = await User.findOne({ email });
      console.log(user)
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already Exist" }] });
      }
      user = new User({
        name,
        email,
        password,
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

router.post("/update", auth, async (req, res) => {

  const { name, age, place, phone, email, password } = req.body;

  const userFields = {};
  if (name) userFields.name = name;
  if (age) userFields.age = age;
  if (phone) userFields.phone = phone;
  if (place) userFields.place = place;
  if (email) userFields.email = email;

  if (password) {
      const salt = await bcrypt.genSalt(10);
      userFields.password = await bcrypt.hash(password, salt);
  }

  try {
    let user = await User.findOne({ _id: req.user.id });

    user = await User.findOneAndUpdate(
      { _id: req.user.id },
      { $set: { ...userFields } },
      { new: true }
    );

    user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
  // res.send("success")
});

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await User.findOne({ _id: req.user.id })
    res.status(200).json({ profile });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.delete("/", auth, async (req, res) => {
  try {
    //delete user
    await User.findOneAndRemove({ _id: req.user.id });
    res.status(200).json({ msg: "User deleted" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});


module.exports = router;
