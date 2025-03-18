const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./db");
const app = express();

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
const cartsRouter = require('./routes/cartsRouter')

const productExistMW = require("./middlewares/productExistMW");
const morgan = require("morgan");

// Connect Database
connectDB();

// Middleware pipleline
app.use(express.json());

app.use(morgan("dev"));

app.use("/users", usersRouter);
app.use("/siteReviews", siteReviewsRouter);
app.use("/categories", categoryRouter);
app.use("/products", productsRouter);
app.use("/products/:id/reviews", productExistMW, reviewsRouter);
app.use('/carts', cartsRouter);
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `http://localhost:${process.env.PORT}/auth/google/callback`,
  passReqToCallback: true
},
  async (req, accessToken, refreshToken, profile, done) => {
    try {
        const data = await googleAuth(profile);
        return done(null, data);
    } catch (error) {
        return done(error, null);
    }
  }
));

passport.serializeUser((data, done) => done(null, data));
passport.deserializeUser((data, done) => done(null, data));

app.use("/auth", authRouter);

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
