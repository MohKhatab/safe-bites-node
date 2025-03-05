const mongoose = require("mongoose");
const APIError = require("./../utils/errors/APIError");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
});

// Make category name lowercase
categorySchema.pre("save", function () {
  this.name = this.name.toLowerCase();
});

// Delete sub categories of category type
categorySchema.pre("deleteOne", async function (next) {
  const categoryId = this.getQuery()._id;
  await Category.deleteMany({ type: categoryId });
  next();
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
