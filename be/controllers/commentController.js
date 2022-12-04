const Comment = require("./../models/commentModel");
const factory = require("./handlerFactory");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");

exports.setProductUserIds = catchAsync(async (req, res, next) => {
  // Allow nested routes
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
});
exports.getTableComment = factory.getTable(Comment);
exports.getAllComments = factory.getAll(Comment);
exports.getComment = factory.getOne(Comment);
exports.createComment = factory.createOne(Comment);
exports.updateComment = factory.updateOne(Comment);
exports.deleteComment = factory.deleteOne(Comment);
exports.isOwner = factory.checkPermission(Comment);
exports.likeComment = catchAsync(async (req, res, next) => {
  const data = await Comment.findById(req.params.id);
  const like = (data.like);
//   console.log(like,typeof like)
  if (!data) return next(new AppError("Không tìm thấy comment này"), 404);
  let result = await like.filter((u) => u != req.user.id);
  if (JSON.stringify(result) === JSON.stringify(like)) result.push(req.user.id);
  data.like = result;
  await data.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    message: "Cập nhật like thành công",
    data: {
      data: data,
    },
  });
});
