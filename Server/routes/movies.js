const router = require("express").Router();
const Movie = require("../Models/Movie");

const verify = require("../VerifyToken");

// Create movie
router.post("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    const newMovie = new Movie(req.body);

    try {
      const savedMovie = await newMovie.save();
      res.status(201).json(savedMovie);
    } catch (error) {
      res.status(400).json(error);
    }
  } else {
    res.status(401).json("  you cannot add a movie!");
  }
});

// Update movie

router.put("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    const newMovie = new Movie(req.body);

    try {
      const updatedMovies = await Movie.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(201).json(updatedMovies);
    } catch (error) {
      res.status(400).json(error);
    }
  } else {
    res.status(401).json("  you are not al!owed to delete a movie!");
  }
});

//  Delete

router.delete("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    const newMovie = new Movie(req.body);

    try {
      await Movie.findByIdAndDelete(req.params.id);
      res.status(201).json("the movie has been delete");
    } catch (error) {
      res.status(400).json(error);
    }
  } else {
    res.status(401).json("  you are not al!owed to delete a movie!");
  }
});

// Get
router.get("/find/:id", verify, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json(error);
  }
});

// get random (featured)

router.get("/random", verify, async (req, res) => {
  const type = req.query.type;
  let movie;
  try {
    if (type === "tvShows") {
      movie = await Movie.aggregate([
        { $match: { isTvShows: true } },
        { $sample: { size: 1 } },
      ]);
    } else {
      movie = await Movie.aggregate([
        { $match: { isTvShows: false } },
        { $sample: { size: 1 } },
      ]);
    }
    res.status(200).json(movie);
  } catch (error) {
    res.status(402).json(error);
  }
});

// Get All
router.get("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const movie = await Movie.find(req.params.id);
      res.status(201).json(movie);
    } catch (error) {
      res.status(400).json(error);
    }
  }
});

module.exports = router;
