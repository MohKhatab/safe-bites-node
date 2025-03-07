const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchemaDb = new mongoose.Schema(
  {
    firstName: {
      type: String,
      reguired: true,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Already Exist, Please Login"],
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      default: "user",
      enum: ["user", "admin"],
    },
    address: {
      country: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      street: {
        type: String,
        trim: true,
      },
    },
    phone: {
      type: String,
      match: [
        /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
        "Please enter a valid phone",
      ],
    },
  },
  { timestamps: true }
);

userSchemaDb.pre("save", async function () {
  this.email = this.email.toLowerCase();
  let hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
});

module.exports = mongoose.model("User", userSchemaDb);
