const mongoose = require("mongoose");
const slugify = require("slugify");
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Thể loại sản phẩm phải có tên"],
      unique: true,
      trim: true,
      maxlength: [
        40,
        "Thể loại sản phẩm tối đa 40 kí tự",
      ],
      minlength: [
        2,
        "Thể loại sản phẩm tối thiểu cần 2 kí tự",
      ],
    },
    slug: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate
// productSchema.virtual("products", {
//   ref: "Product",
//   foreignField: "category",
//   localField: "_id",
// });

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
categorySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
