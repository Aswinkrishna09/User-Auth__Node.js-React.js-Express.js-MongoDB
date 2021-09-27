const express = require("express");
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");

//Public Route
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).send(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server err");
  }
});

router.post(
  "/login",
  [
    check("email", "Please enter a valid Email").isEmail(),
    check("password", "Password is required ").exists(),
  ],
  async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
    // check if user exist or not
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }
     
      const match = await bcrypt.compare(password,user.password);
      if(!match){
        res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] })
      }
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

module.exports = router;
