// review / rating / createdAt / ref to product / ref to user
const mongoose = require("mongoose");
const Product = require("./productModel");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Đánh giá không thể để trống!"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Vui lòng cung cấp sản phẩm đánh giá."],
    },
    updateAt: Date,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Đánh giá phải từ một người dùng nào đó"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });
reviewSchema.index({ "$**": "text" });

reviewSchema.pre(/^find/, async function (next) {
  // this.populate({
  //   path: 'product',
  //   select: 'name'
  // }).populate({
  //   path: 'user',
  //   select: 'name avatar'
  // });
  this.populate({
    path: "user",
    select: "name avatar",
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (productId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: "$product",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
        fiveRating: {
          $sum: {
            $cond: [{ $eq: ["$rating", 5] }, 1, 0],
          },
        },
        fourRating: {
          $sum: {
            $cond: [{ $eq: ["$rating", 4] }, 1, 0],
          },
        },
        threeRating: {
          $sum: {
            $cond: [{ $eq: ["$rating", 3] }, 1, 0],
          },
        },
        twoRating: {
          $sum: {
            $cond: [{ $eq: ["$rating", 2] }, 1, 0],
          },
        },
        oneRating: {
          $sum: {
            $cond: [{ $eq: ["$rating", 1] }, 1, 0],
          },
        },
        reviews: { $push: "$$ROOT" },
      },
    },
  ]);
  // console.log(stats);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
      eachRating: [
        Number(stats[0].oneRating),
        Number(stats[0].twoRating),
        Number(stats[0].threeRating),
        Number(stats[0].fourRating),
        Number(stats[0].fiveRating),
      ],
      review: stats[0].reviews,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
      eachRating: [0, 0, 0, 0, 0],
      review: [],
    });
  }
};

reviewSchema.post("save", function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.product);
});

// findByIdAndUpdate
// findByIdAndDelete
// reviewSchema.pre(/^findOneAnd/, async function (next) {
//   this.r = await this.findOne();
//   // console.log(this.r);
//   next();
// });

// reviewSchema.post(/^findOneAnd/, async function () {
//   await this.r.constructor.calcAverageRatings(this.r.product);
// });

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
