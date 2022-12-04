// Comment / rating / createdAt / ref to product / ref to user
const mongoose = require("mongoose");
const Product = require("./productModel");

const CommentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, "Bình luận không thể để trống!"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Vui lòng cung cấp sản phẩm Bình luận."],
    },
    updateAt: Date,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Bình luận phải từ một người dùng nào đó"],
    },
    parent: {
      type: mongoose.Schema.ObjectId,
      ref: "Comment",
      default: null,
    },
    like: [],
    children: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

CommentSchema.index({ "$**": "text" });
// Virtual populate

// CommentSchema.virtual("children", {
//   ref: "Comment",
//   foreignField: "parent",
//   localField: "_id",
// });

CommentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name avatar role",
  })
    .populate({
      path: "children",
      select: "-__v",
    })
  next();
});
// CommentSchema.pre("findOneAndDelete", async function (next) {
//   const data = await this.findOne().clone();
//   await this.remove({
//     _id: { $in: data.children },
//   });
//   next();
// });

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
