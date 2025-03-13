const User = require("../models/User");
const jwt = require("jsonwebtoken");
const APIError = require("../utils/errors/APIError");

const googleAuth = async (profile) => {
  try {
    let foundUser = await User.findOne({ email: profile.emails[0].value });
    if (!foundUser) {
      foundUser = await User.create({
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        password: "google-auth", // Virtual --> default
      });
    }

    const token = jwt.sign(
      {
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        id: foundUser.id,
        role: foundUser.role,
      },
      process.env.SECRETKEY,
      { expiresIn: "10h" }
    );
    return { user: foundUser, token };
  } catch (err) {
    throw new APIError("Authentication with google field", 404);
  }
};

module.exports = googleAuth;
