const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    bname: { type: String, required: true },
    btype: { type: String, required: true },
    quantity: { type: String, required: true },
    price: { type: String, required: true },
    details: { type: String, required: true },
    date: { type: Date, default: Date.now },
    file_mimetype: {
      type: String,
    },
    imagename: {
      type: String,
    },
    image: {
      data:Buffer,contentType:String
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("newbook", bookSchema);