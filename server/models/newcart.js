const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    bname: { type: String, required: true },
    btype: { type: String, required: true },
    quantity: { type: String, required: true },
    price: { type: String, required: true },
    details: { type: String, required: true },
    total: { type: String, required: true },
    userid: { type: String, required: true },
    bookid: { type: String, required: true },
    paymentstatus: { type: String, default: Date.now },
    date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("newcart", cartSchema);