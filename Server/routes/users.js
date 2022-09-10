const router = require("express").Router();
const User = require("../Models/User");
const CryptoJS = require("crypto-js");
const verify = require("../VerifyToken");
const { query } = require("express");

//Update
router.put("/:id", verify, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY
      ).toString();
    }
    try {
      const updatedUsers = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUsers);
    } catch (error) {
      res.status(401).json(error);
    }
  } else {
    res.status(401).json("  you can update only your account!");
  }
});

//Delete

router.delete("/:id", verify, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("user has been deleted...");
    } catch (error) {
      res.status(401).json(error);
      console.log(error);
    }
  } else {
    res.status(401).json("  you can delete only your account!");
  }
});

// Get single user

router.get("/find/:id", async (req, res) => {
  try {
    const users = await User.findById(req.params.id);
    const { password, ...info } = users._doc;
    res.status(200).json(info);
  } catch (error) {
    res.status(401).json(error);
  }
});

// Get all users
router.get("/", verify, async (req, res) => {
  const query = req.query.new;
  if (req.user.isAdmin) {
    try {
      const users = query ? await User.find().limit(10) : await User.find();

      res.status(200).json(users);
    } catch (error) {
      res.status(401).json(error);
    }
  } else {
    res.status(401).json(" you cannot access all users");
  }
});

//Get user stats
router.get("/stats", async (req, res) => {
  const today = new Date();
  const lastYear = today.setFullYear(today.setFullYear() - 1);

  const monthsArray = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  try {
    const data = await User.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (error) {
    res.status(402).json(error);
  }
});

module.exports = router;
