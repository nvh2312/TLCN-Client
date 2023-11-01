const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");
const Product = require("./../models/productModel");
const Review = require("./../models/reviewModel");
const Order = require("./../models/orderModel");
const Import = require("./../models/importModel");
const User = require("./../models/userModel");
const Comment = require("./../models/commentModel");
const io = require("../socket");

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

function handleQuery(req, value) {
  const obj = {};
  if (req.query[value + "_lt"] != undefined) obj.lt = req.query[value + "_lt"];
  if (req.query[value + "_lte"] != undefined)
    obj.lte = req.query[value + "_lte"];
  if (req.query[value + "_gt"] != undefined) obj.gt = req.query[value + "_gt"];
  if (req.query[value + "_gte"] != undefined)
    obj.gte = req.query[value + "_gte"];
  if (JSON.stringify(obj) !== "{}") req.query[value] = obj;
}

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (Model == Import) {
      const invoice = await Model.findById(req.params.id);
      await invoice.invoice.forEach(async (value, index) => {
        await Product.findByIdAndUpdate(value.product, {
          $inc: { inventory: -value.quantity },
        });
      });
    }
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("Không tìm thấy dữ liệu với ID này", 404));
    }
    if (Model == Review) {
      Model.calcAverageRatings(doc.product);
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (Model == Product) {
      req.body.updatedBy = req.user.id;
      req.body.updatedAt = Date.now() - 1000;
      req.body.description = req.body.description
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
      if (req.body.promotion >= req.body.price)
        return next(new AppError("Giá giảm phải nhỏ hơn giá gốc", 500));
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: false,
      });
      if (!doc) {
        return next(new AppError("Không tìm thấy dữ liệu với ID này", 404));
      }

      res.status(200).json({
        status: "success",
        data: {
          data: doc,
        },
      });
    }
    if (Model == Order && req.body.status == "Cancelled") {
      const cart = req.order.cart;
      for (const value of cart) {
        await Product.findByIdAndUpdate(value.product._id, {
          $inc: { inventory: value.quantity },
        });
      }
    }

    if (Model == Import) {
      const invoice = await Model.findById(req.params.id);
      await invoice.invoice.forEach(async (value, index) => {
        await Product.findByIdAndUpdate(value.product, {
          $inc: { inventory: -value.quantity },
        });
      });
      const product = req.body.invoice;
      for (const value of product) {
        await Product.findByIdAndUpdate(value.product, {
          $inc: { inventory: value.quantity },
        });
      }
    }

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("Không tìm thấy dữ liệu với ID này", 404));
    }

    if (Model === Comment) {
      const rootComment = await findRootCommentByChildren(doc._id.toString());
      io.getIO().emit("comments", {
        action: "update",
        product: doc.product._id.toString(),
        comment: rootComment,
      });
    }

    if (Model == Review) {
      Model.calcAverageRatings(doc.product);
    }
    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (Model == Product) {
      req.body.createdBy = req.user.id;
    }

    if (Model == Import) {
      const invoice = req.body.invoice;
      for (const value of invoice) {
        await Product.findByIdAndUpdate(value.product, {
          $inc: { inventory: value.quantity },
        });
      }
    }

    const doc = await Model.create(req.body);
    if (Model === Comment) {
      const data = await Comment.findById(req.body.parent);
      let action = "create";
      if (data) {
        action = "update";
        data.children.push(doc.id);
        await data.save({ validateBeforeSave: false });
      }
      const rootComment = await findRootCommentByChildren(doc._id.toString());
      const totalData = await Comment.countDocuments({
        parent: null,
        product: req.body.product,
      });
      const totalPages = Math.ceil(totalData / 3);
      io.getIO().emit("comments", {
        action,
        product: req.body.product,
        comment: rootComment,
        totalPages,
      });
    }
    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError("Không tìm thấy dữ liệu với ID này", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    handleQuery(req, "price");
    handleQuery(req, "promotion");
    // To allow for nested GET reviews on tour (hack)
    let filter = {};
    if (req.params.productId) filter = { product: req.params.productId };
    if (Model == Comment) filter.parent = null;
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;
    let totalPage = 1;

    if (Model == Review && req.params.productId) {
      const more = await Product.findById(req.params.productId).populate({
        path: "reviews",
      });
      const totalFilter = more.reviews.length;
      if (req.query.page != undefined) {
        totalPage = Math.ceil(totalFilter / Number(req.query.limit));
      }
      if (req.query.page > totalPage)
        return res.status(200).json({
          status: "success",
          data: {
            data: doc,
            results: doc.length,
            ratingsQuantity: more.ratingsQuantity,
            ratingsAverage: more.ratingsAverage,
            eachRating: more.eachRating,
            totalPage: 1,
          },
        });
      return res.status(200).json({
        status: "success",
        data: {
          data: doc,
          results: doc.length,
          ratingsQuantity: more.ratingsQuantity,
          ratingsAverage: more.ratingsAverage,
          eachRating: more.eachRating,
          totalPage,
        },
      });
    }

    if (req.query.page != undefined) {
      const filterModel = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields();
      const filterData = await filterModel.query;

      totalPage = Math.ceil(filterData.length / Number(req.query.limit));
      if (req.query.page > totalPage)
        return res.status(200).json({
          status: "success",
          data: {
            data: doc,
            results: doc.length,
            totalPage: 1,
          },
        });
    }
    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        data: doc,
        totalPage,
        currentPage: req.query.page,
      },
    });
  });
exports.getTable = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    let searchStr = req.query.search["value"];
    if (searchStr) {
      // filter.push({ title: regex });
      filter["$text"] = { $search: searchStr };
    }
    if (Model == User) filter["role"] = { $ne: "admin" };

    Model.count({}, function (err, c) {
      const recordsTotal = c;
      Model.count(filter, function (err, c) {
        const recordsFiltered = c;
        Model.find(
          filter,
          {},
          {
            sort: { _id: -1 },
            skip: Number(req.query.start),
            limit: Number(req.query.length),
          },
          function (err, results) {
            if (err) {
              return;
            }
            const data = {
              draw: req.query.draw,
              recordsFiltered: recordsFiltered,
              recordsTotal: recordsTotal,
              data: results,
            };
            res.status(200).json(data);
          }
        );
      });
    });
  });
exports.checkPermission = (Model) =>
  catchAsync(async (req, res, next) => {
    // 1) Get review id from param and findById to get review information
    const doc = await Model.findById(req.params.id);
    // 2) if user is owner, allow to update or delete data
    if (req.user.id != doc.user._id && req.user.role == "user") {
      return next(new AppError("Bạn không có quyền để thực hiện", 403));
    }
    if (Model == Order) {
      req.order = doc;
    }
    next();
  });
