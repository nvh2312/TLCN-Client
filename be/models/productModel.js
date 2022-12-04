const mongoose = require("mongoose");
const domPurifier = require("dompurify");
const { JSDOM } = require("jsdom");
const htmlPurify = domPurifier(new JSDOM().window);

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Sản phẩm phải có tên phân biệt"],
      unique: true,
      trim: true,
      maxlength: [200, "Tên sản phẩm tối đa 200 kí tự"],
      minlength: [10, "Tên sản phẩm tối thiểu 10 kí tự"],
      // validate: [validator.isAlpha, 'product name must only contain characters']
    },
    price: {
      type: Number,
      required: [true, "Vui lòng cung cấp giá sản phẩm"],
    },
    promotion: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation
          return val <= this.price;
        },
        message: "Giá giảm: ({VALUE}) phải nhỏ hơn giá gốc",
      },
    },
    description: String,
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Đánh giá từ 1 sao trở lên"],
      max: [5, "Đánh giá tối đa 5 sao"],
      set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    eachRating: [Number],
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    inventory: {
      type: Number,
      default: 0,
    },
    color: String,
    cpu: String,
    ram: String,
    os: String,
    weight: Number,
    screen: String,
    graphicCard: String,
    battery: String,
    demand: String,
    updatedAt: Date,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    review: [Array],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.index({ price: 1, ratingsAverage: -1 });
productSchema.index({ "$**": "text" });
productSchema.virtual("percent").get(function () {
  return !this.promotion
    ? 0
    : Number((((this.price - this.promotion) * 100) / this.price).toFixed());
});
// Virtual populate
productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});
productSchema.pre("create", function (next) {
  //check if there is a description
  if (this.description) {
    this.description = htmlPurify.sanitize(this.description);
  }
  next();
});
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name",
  })
    .populate({
      path: "brand",
      select: "name",
    })
    .populate({
      path: "createdBy",
      select: "name",
    });
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
