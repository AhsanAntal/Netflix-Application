const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const movieRoute = require("./routes/movies");
const listRoute = require("./routes/lists");

dotenv.config();
app.use(express.json());
// connect database
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("db is connected"))
  .catch((err) => console.log(err));

app.use(cors());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/movies", movieRoute);
app.use("/api/lists", listRoute);

app.listen(3001, () => {
  console.log("server is running");
});
