const Comment = require("./../models/commentModel");
const factory = require("./handlerFactory");
const AppError = require("./../utils/appError");
const io = require("../socket");
const catchAsync = require("./../utils/catchAsync");

exports.setProductUserIds = catchAsync(async (req, res, next) => {
  // Allow nested routes
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
});
async function deleteChildComments(commentId) {
  const childComments = await Comment.find({ parent: commentId });
  for (let i = 0; i < childComments.length; i++) {
    const childComment = childComments[i];
    await deleteChildComments(childComment._id);
  }
  await Comment.deleteMany({ _id: commentId });
}

async function findRootCommentByChildren(commentId) {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    return null;
  }

  if (!comment.parent) {
    return comment;
  }

  return findRootCommentByChildren(comment.parent);
}

exports.getTableComment = factory.getTable(Comment);
exports.getAllComments = factory.getAll(Comment);
exports.getComment = factory.getOne(Comment);
exports.createComment = factory.createOne(Comment);
exports.updateComment = factory.updateOne(Comment);
exports.deleteComment = catchAsync(async (req, res, next) => {
  const doc = await Comment.findByIdAndDelete(req.params.id);
  const rootCmt = doc.parent
    ? await findRootCommentByChildren(doc.parent.toString())
    : "";
  await deleteChildComments(req.params.id);
  if (doc.parent != null) {
    const parent = await Comment.findById(doc.parent);
    const newChildren = await parent.children.filter(
      (child) => child.id != doc.id
    );
    parent.children = newChildren;
    await parent.save({ validateBeforeSave: false });
    const rootComment = await Comment.findById(rootCmt._id.toString());
    io.getIO().emit("comments", {
      action: "update",
      product: doc.product._id.toString(),
      comment: rootComment,
    });
  } else {
    const totalData = await Comment.countDocuments({
      parent: null,
      product: doc.product._id.toString(),
    });
    const totalPages = Math.ceil(totalData / 3);
    io.getIO().emit("comments", {
      action: "delete",
      product: doc.product._id.toString(),
      totalPages,
    });
  }
  res.status(204).json({
    message: "success",
    data: null,
  });
});
exports.isOwner = factory.checkPermission(Comment);
exports.likeComment = catchAsync(async (req, res, next) => {
  const data = await Comment.findById(req.params.id);
  const like = data.like;
  //   console.log(like,typeof like)
  if (!data) return next(new AppError("Không tìm thấy comment này"), 404);
  let result = await like.filter((u) => u != req.user.id);
  if (JSON.stringify(result) === JSON.stringify(like)) result.push(req.user.id);
  data.like = result;
  await data.save({ validateBeforeSave: false });
  const rootComment = await findRootCommentByChildren(req.params.id);
  io.getIO().emit("comments", {
    action: "like",
    product: data.product._id.toString(),
    comment: rootComment,
  });
  res.status(200).json({
    status: "success",
    message: "Cập nhật like thành công",
    data: {
      data,
    },
  });
});
