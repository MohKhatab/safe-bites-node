const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./db");
const app = express();

// File imports
const usersRouter = require("./routes/usersRouter");
const siteReviewsRouter = require("./routes/siteReviewsRouter");
const categoryRouter = require("./routes/categoriesRouter");
const morgan = require("morgan");

// Connect Database
connectDB();

// Middleware pipleline
app.use(express.json());

app.use(morgan("dev"));

app.use("/users", usersRouter);
app.use("/siteReviews", siteReviewsRouter);
app.use("/categories", categoryRouter);

app.use((err, req, res, next) => {
  if (err) {
    console.log("Error MW was called");

    console.log(err);
    return res.status(err.statusCode || 500).json({
      error: err.message,
    });
  }
  next();
});

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});
