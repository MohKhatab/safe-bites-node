const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./db");
const app = express();
const cors = require("cors");

// File imports
const usersRouter = require("./routes/usersRouter");
const siteReviewsRouter = require("./routes/siteReviewsRouter");
const categoryRouter = require("./routes/categoriesRouter");
const productsRouter = require("./routes/productsRouter");
const reviewsRouter = require("./routes/reviewsRouter");

const productExistMW = require("./middlewares/productExistMW");
const morgan = require("morgan");

// Connect Database
connectDB();

// Middleware pipleline
const corsOptions = {
  credentials: true,
  origin: ["*", "http://localhost:4200"],
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(morgan("dev"));

app.use("/users", usersRouter);
app.use("/siteReviews", siteReviewsRouter);
app.use("/categories", categoryRouter);
app.use("/products", productsRouter);
app.use("/products/:id/reviews", productExistMW, reviewsRouter);

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
