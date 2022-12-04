const Review = require("./../models/reviewModel");
const Order = require("./../models/orderModel");
const factory = require("./handlerFactory");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");

exports.setProductUserIds = catchAsync(async (req, res, next) => {
  // Allow nested routes
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user.id;
  const data = await Order.find({ user: req.body.user });
  if (data[0] == undefined) {
    return next(
      new AppError(
        "Bạn chưa thể đánh giá lúc này.Vui lòng mua hàng trước khi đánh giá!!!",
        403
      )
    );
  }
  let kt = 0;
  await data.forEach(async (val, index) => {
    await val.cart.forEach((value, index) => {
      if (value.product._id == req.body.product && val.status == "Success") {
        kt = 1;
        return next();
      }
    });
  });
  if (kt == 0)
    return next(
      new AppError(
        "Bạn chưa thể đánh giá lúc này.Vui lòng mua hàng trước khi đánh giá!!!",
        403
      )
    );
});
exports.getTableReview = factory.getTable(Review);
exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.isOwner = factory.checkPermission(Review);
