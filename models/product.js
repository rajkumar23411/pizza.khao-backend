const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  oldPrice: { type: Number, required: true },
  description: { type: String, required: true },
  ratings: { type: Number, default: 0 },
  category: { type: String, required: true },
  numOfReviews: { type: String, default: 0 },
  reviews: [
    {
      user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
      name: { type: String, required: true },
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
    },
  ],
  user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Product", productSchema);
