const User = require("./../models/User");
const APIError = require("./../utils/errors/APIError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const getUser = async (req, res, next) => {
  try {
    const users = await User.find();
    if(!users.length){
      throw new APIError(`No Users In Data Base`,404);
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

const loginUser = async (req, res, next)=>{
  const user = req.body;
  user.email = user.email.toLowerCase();
  let foundUser = await User.findOne({email: user.email});
  if(!foundUser){
    // Search For Status Code
    return res.status(200).json({message: "Invalid Email / Password"});
  } 
  let truePassword = await bcrypt.compare(user.password, foundUser.password);
  if(!truePassword){
    return res.status(200).json({message: "Invalid Email / Password"});
  }
  let token = await jwt.sign({firstName: foundUser.firstName,email: foundUser.email, id: foundUser.id, role: foundUser.role}
    , process.env.SECRETKEY
    , { expiresIn: '10h' });
  
  res.header("x-auth-token",token);  
  res.status(200).json({message: "Logged In Successfully"})

}

module.exports = { getUser, getUserById, createUser, loginUser };
