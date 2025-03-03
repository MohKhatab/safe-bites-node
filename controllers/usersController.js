const User = require("./../models/User");
const APIError = require("./../utils/errors/APIError");

const getUser = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).send({ message: "users fetched succesfully", users });
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new APIError("User not found", 404);
    }

    res.status(200).send({ message: "user fetched successfully", user });
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).send({ message: "User created successfully", data: user });
  } catch (err) {
    next(err);
  }
};

module.exports = { getUser, getUserById, createUser };
