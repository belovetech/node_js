const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please, tell us your name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "please, provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please, provide a valid email"],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "please, provide your password"],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, "please, confirm your password"],
    validate: {
      //This only works on CREATE AND SAVE()
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
  },
});

userSchema.pre("save", async function (next) {
  // Only run this if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //   Delete passwordConfirm
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
