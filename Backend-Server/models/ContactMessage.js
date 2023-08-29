const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: Number,
    required: true,
  },
  countrycode: {
    type: String,
    required: true,
  }
},

  // Add timestamps for when the document is created and last modified
  { timestamps: true }
);

module.exports = mongoose.model("ContactMessage", userSchema);