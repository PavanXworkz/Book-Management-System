const mongoose = require("mongoose");

const NewUserSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phnum: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  fathername: {
    type: String,
    required: true,
  },
  mothername: {
    type: String,
    required: true,
  },
  parentphnum: {
    type: String,
    required: true,
  },
  parentaddress: {
    type: String,
    required: true,
  },
},
  {
    timestamps: true,
  });

module.exports = mongoose.model("newuser", NewUserSchema);