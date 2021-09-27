const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const config = require("config");
const request = require("request");
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Post");
const bcrypt = require("bcryptjs");
//Private Route
// /api/profile/me
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await User.findById(req.user.id).select("-password");
    res.status(200).json({ profile });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

//api/profile

router.post("/", auth, async (req, res) => {
  const { name, age, place, phone, email, password } = req.body;
  if (password && password.length < 6) {
    return res.status(200).json({ passErr: true });
  }
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
    let testEmail = await User.findOne({ email });
    if (testEmail && testEmail._id !== req.user.id) {
      return res.status(200).json({ msg: "User Already Exist", exist: true });
    }
    let user = await User.findOne({ _id: req.user.id });

    user = await Profile.findOneAndUpdate(
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
router.get("/", async (req, res) => {
  try {
    let profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.status(200).send(profiles);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/user/:user_id", async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.params.user_id }).populate(
      "user",
      ["name", "avatar"]
    );
    if (!profile) {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.status(200).send(profile);
  } catch (err) {
    console.log(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.status(500).send("Server Error");
  }
});

router.delete("/", auth, async (req, res) => {
  try {
    //delete users posts
    await Post.deleteMany({ user: req.user.id });
    //delete user
    await User.findOneAndRemove({ _id: req.user.id });
    //delete profile
    await Profile.findOneAndRemove({ user: req.user.id });
    res.status(200).json({ msg: "User deleted" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

//@route PUT api/profile/experience
//@desc  Add experience
//access Private

router.put(
  "/experience",
  [
    auth,
    [
      check("title", "title is required").not().isEmpty(),
      check("company", "company is required").not().isEmpty(),
      check("from", "From data is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { company, title, location, from, to, current, description } =
      req.body;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(req.body);
      await profile.save();
      res.status(200).json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route delete api/profile/experience/:exp-id
//@desc  Delete experience
//access Private
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    //take experience
    let indexId = profile.experience
      .map((exp) => exp._id)
      .indexOf(req.params.exp_id);
    profile.experience.splice(indexId, 1);
    await profile.save();
    res.status(200).json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

//@route PUT api/profile/education
//@desc  Add education
//access Private

router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required").not().isEmpty(),
      check("degree", "Degree is required").not().isEmpty(),
      check("fieldofstudy", "Field of study is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(req.body);
      await profile.save();
      res.status(200).json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route delete api/profile/education/:edu_id
//@desc  Delete education
//access Private
router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    //take education
    let indexId = profile.education
      .map((edu) => edu._id)
      .indexOf(req.params.edu_id);
    profile.education.splice(indexId, 1);
    await profile.save();
    res.status(200).json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

//@route get api/profile/github/username
//@desc  get repos
//access Public
router.get("/github/:username", async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "clientId"
      )}&client_secret=${config.get("clientSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    };
    request(options, (err, response, body) => {
      if (err) console.error(err);
      if (response.statusCode !== 200) {
        console.log(response.statusCode);
        return res.status(404).json({ msg: "user not found" });
      }
      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
