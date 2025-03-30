const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./db");
const app = express();
const cors = require("cors");

// Google Auth
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const googleAuth = require("./controllers/authController");
const authRouter = require("./routes/authRouter");

// File imports
const usersRouter = require("./routes/usersRouter");
const siteReviewsRouter = require("./routes/siteReviewsRouter");
const categoryRouter = require("./routes/categoriesRouter");
const productsRouter = require("./routes/productsRouter");
const reviewsRouter = require("./routes/reviewsRouter");
const cartsRouter = require("./routes/cartsRouter");
const uploadRouter = require("./routes/uploadRouter");
const wishlistRouter = require("./routes/wishListRouter");

const productExistMW = require("./middlewares/productExistMW");
const morgan = require("morgan");

// Connect Database
connectDB();

// Middleware pipleline
app.use("/image", uploadRouter);
const corsOptions = {
  credentials: true,
  origin: ["http://localhost:4203"],
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(morgan("dev"));

app.use("/users", usersRouter);
app.use("/siteReviews", siteReviewsRouter);
app.use("/categories", categoryRouter);
app.use("/products", productsRouter);
app.use("/products/:id/reviews", productExistMW, reviewsRouter);
app.use("/wishlist", wishlistRouter);
app.use("/carts", cartsRouter);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `http://localhost:${process.env.PORT}/auth/google/callback`,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const data = await googleAuth(profile);
        return done(null, data);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((data, done) => done(null, data));
passport.deserializeUser((data, done) => done(null, data));

app.use("/auth", authRouter);

app.use((err, req, res, next) => {
  if (err.cause?.code === 11000) {
    return res.status(400).json({
      error: err.message,
    });
  }

  if (err.name == "ValidationError") {
    return res.status(400).json({
      error: `Mongoose Validation Error: ${err.message}`,
    });
  }

  if (err.name == "CastError" && err.kind == "ObjectId") {
    return res.status(400).json({
      error: "Invalid reference ID, Please provide a correct ObjectId",
    });
  }

  if (err) {
    return res.status(err.statusCode || 500).json({
      error: err.message,
    });
  }
  next();
});

app.all("*", (req, res, next) => {
  res
    .status(404)
    .json({ error: `The path ${req.originalUrl} isn't on the server` });
  next();
});

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});
