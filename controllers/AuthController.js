const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/signin", (req, res) => {
  User.findOne(req.body, async function(err, user) {
    if (err) console.log(err);
    else {
      res.json({ user });
    }
  });
});

router.post("/signup", (req, res) => {
  const newUser = new User(req.body);
  newUser.save(async function(err, added) {
    if (err) console.log(err);
    else {
      res.json({ success: true });
    }
  });
});

module.exports = router;
