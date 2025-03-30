const User = require("./../models/User");
const APIError = require("./../utils/errors/APIError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const getUser = async (req, res, next) => {
  try {
    const users = await User.find();
    if (!users.length) {
      throw new APIError(`No Users In Data Base`, 404);
    }
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

const updateUser = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, ...updateData } = req.body;

    // Deny update of another user
    if (req.user.id != req.params.id) {
      throw new APIError(
        "Forbidden: You are not allowed to edit the data of another user",
        403
      );
    }

    // Get the user
    const user = await User.findById(req.user.id);

    if (!user) {
      throw new APIError(`User not found`, 404);
    }

    // Hash the incoming old password and new password
    if (oldPassword && newPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) throw new APIError("Old password is incorrect", 400);

      updateData.password = newPassword;
    }

    if (updateData.address) {
      updateData.address = { ...user.address, ...updateData.address };
    }

    // Remove any undefined field to avoid removing data from the user
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) delete updateData[key];
    });

    // Update user
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user.id },
      updateData,
      { new: true, runValidators: true, context: "query" }
    );

    res
      .status(200)
      .send({ message: "User updated successfully", data: updatedUser });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      throw new APIError("User not found", 404);
    }
    res.status(200).send({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  const user = req.body;
  user.email = user.email.toLowerCase();
  let foundUser = await User.findOne({ email: user.email });
  if (!foundUser) {
    return res.status(400).json({ message: "Invalid Email / Password" });
  }
  let truePassword = await bcrypt.compare(user.password, foundUser.password);
  if (!truePassword) {
    return res.status(200).json({ message: "Invalid Email / Password" });
  }
  let token = await jwt.sign(
    {
      firstName: foundUser.firstName,
      email: foundUser.email,
      id: foundUser.id,
      role: foundUser.role,
    },
    process.env.SECRETKEY,
    { expiresIn: "10h" }
  );

  res.status(200).json({ message: "Logged In Successfully", token });
};

module.exports = {
  getUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
};
