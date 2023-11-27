const Order = require("./../models/orderModel");
const factory = require("./handlerFactory");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Product = require("../models/productModel");
const sendEmail = require("../utils/email");
const mailTemplate = require("./mailTemplate");
const io = require("../socket");

exports.checkStatusOrder = catchAsync(async (req, res, next) => {
  if (
    req.user.role == "user" &&
    ((req.body.status == "Cancelled" && req.order.status != "Processed") ||
      req.body.status != "Cancelled")
  ) {
    return next(new AppError("Bạn không có quyền thực hiện.", 403));
  }
  if (req.order.status == "Cancelled" || req.order.status == "Success") {
    return next(new AppError(`Đơn hàng nãy đã ${req.order.status}`, 403));
  }
  next();
});
exports.getTableOrder = factory.getTable(Order);
exports.createOrder = catchAsync(async (req, res, next) => {
  const cart = req.body.cart;
  for (const value of cart) {
    const name =
      value.product.title.length > 39
        ? value.product.title.slice(0, 40)
        : value.product.title;
    const invent = await Product.findById(value.id);
    if (value.quantity > invent.inventory) {
      return next(
        new AppError(`Số lượng hàng ${name} trong kho không đủ`, 500)
      );
    }
  }

  const doc = await Order.create(req.body);

  for (const value of cart) {
    await Product.findByIdAndUpdate(value.id, {
      $inc: { inventory: -value.quantity },
    });
  }
  io.getIO().emit("orders", {
    user: req.user.name,
  });
  try {
    const domain = `${req.protocol}://${req.get("host")}`;
    const message = mailTemplate(doc, domain);
    await sendEmail({
      email: req.user.email,
      subject: "Đơn mua hàng tại HC.VN",
      message,
    });
  } catch (err) {
    return res.status(201).json({
      status: "success",
      data: {
        id: doc.id,
        totalPrice: doc.totalPrice,
      },
    });
  }
  return res.status(201).json({
    status: "success",
    data: {
      id: doc.id,
      totalPrice: doc.totalPrice,
    },
  });
});
exports.getOrder = factory.getOne(Order);
exports.getAllOrders = factory.getAll(Order);
exports.updateOrder = factory.updateOne(Order);
exports.deleteOrder = factory.deleteOne(Order);
exports.isOwner = factory.checkPermission(Order);
exports.setUser = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user;
  next();
};
exports.countStatus = catchAsync(async (req, res, next) => {
  const data = await Order.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  res.status(200).json(data);
});

exports.countStatusOption = catchAsync(async (req, res, next) => {
  const option = {
    status: "$status",
  };
  if (req.body.year) option.year = { $year: "$createdAt" };
  if (req.body.month) option.month = { $month: "$createdAt" };
  if (req.body.week) option.week = { $week: "$createdAt" };
  if (req.body.date) option.date = { $dayOfWeek: "$createdAt" };
  const data = await Order.aggregate([
    {
      $group: {
        _id: option,
        count: { $sum: 1 },
      },
    },
  ]);
  res.status(200).json(data);
});
exports.sumRevenueOption = catchAsync(async (req, res, next) => {
  const option = {};
  if (req.body.year) option.year = { $year: "$createdAt" };
  if (req.body.month) option.month = { $month: "$createdAt" };
  if (req.body.week) option.week = { $week: "$createdAt" };
  if (req.body.date) option.date = { $dayOfWeek: "$createdAt" };
  const data = await Order.aggregate([
    {
      $match: { status: "Success" },
    },
    {
      $group: {
        _id: option,
        total_revenue: { $sum: "$totalPrice" },
        // bookings_month: {
        //   $push: {
        //     each_order: "$totalPrice",
        //   },
        // },
      },
    },
  ]);
  res.status(200).json(data);
});
exports.sumRevenue = catchAsync(async (req, res, next) => {
  const data = await Order.aggregate([
    {
      $match: { status: "Success" },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        total_revenue_month: { $sum: "$totalPrice" },
        // bookings_month: {
        //   $push: {
        //     each_order: "$totalPrice",
        //   },
        // },
      },
    },
  ]);
  res.status(200).json(data);
});
exports.topProduct = catchAsync(async (req, res, next) => {
  const option = {
    product: "$cart.product.id",
  };
  if (req.body.year) option.year = { $year: "$createdAt" };
  if (req.body.month) option.month = { $month: "$createdAt" };
  if (req.body.week) option.week = { $week: "$createdAt" };
  if (req.body.date) option.date = { $dayOfWeek: "$createdAt" };

  const data = await Order.aggregate([
    {
      $unwind: "$cart",
    },
    {
      $match: { status: "Success" },
    },
    {
      $group: {
        _id: option,
        quantity: { $sum: "$cart.quantity" },
        title: { $first: "$cart.product.title" },
        image: { $first: "$cart.product.images" },
      },
    },
    { $sort: { quantity: -1 } },
    { $limit: 5 },
  ]);
  res.status(200).json(data);
});

exports.countStatusInRange = catchAsync(async (req, res, next) => {
  const dateFrom = req.body.dateFrom;
  const dateTo = req.body.dateTo;
  const option = {
    status: "$status",
  };
  let dateStart = new Date(dateFrom);
  dateStart;
  let dateEnd = new Date(dateTo);
  dateStart.setUTCHours(0, 0, 0, 0);
  dateEnd.setUTCHours(23, 59, 59, 999);
  dateStart.setTime(dateStart.getTime() + 14 * 60 * 60 * 1000);
  dateEnd.setTime(dateEnd.getTime() + 14 * 60 * 60 * 1000);
  const data = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: dateStart, $lt: dateEnd },
      },
    },
    {
      $group: {
        _id: option,
        count: { $sum: 1 },
      },
    },
  ]);
  res.status(200).json(data);
});
exports.topProductInRange = catchAsync(async (req, res, next) => {
  const option = {
    product: "$cart.product.id",
  };
  const dateFrom = req.body.dateFrom;
  const dateTo = req.body.dateTo;
  let dateStart = new Date(dateFrom);
  dateStart;
  let dateEnd = new Date(dateTo);
  dateStart.setUTCHours(0, 0, 0, 0);
  dateEnd.setUTCHours(23, 59, 59, 999);
  dateStart.setTime(dateStart.getTime() + 14 * 60 * 60 * 1000);
  dateEnd.setTime(dateEnd.getTime() + 14 * 60 * 60 * 1000);
  const data = await Order.aggregate([
    {
      $unwind: "$cart",
    },
    {
      $match: {
        status: "Success",
        createdAt: { $gte: dateStart, $lt: dateEnd },
      },
    },
    {
      $group: {
        _id: option,
        quantity: { $sum: "$cart.quantity" },
        title: { $first: "$cart.product.title" },
        image: { $first: "$cart.product.images" },
      },
    },
    { $sort: { quantity: -1 } },
    { $limit: 5 },
  ]);
  res.status(200).json(data);
});
exports.sumInRange = catchAsync(async (req, res, next) => {
  const dateFrom = req.body.dateFrom;
  const dateTo = req.body.dateTo;
  let dateStart = new Date(dateFrom);
  dateStart;
  let dateEnd = new Date(dateTo);
  dateStart.setUTCHours(0, 0, 0, 0);
  dateEnd.setUTCHours(23, 59, 59, 999);
  dateStart.setTime(dateStart.getTime() + 14 * 60 * 60 * 1000);
  dateEnd.setTime(dateEnd.getTime() + 14 * 60 * 60 * 1000);
  const data = await Order.aggregate([
    {
      $match: {
        status: "Success",
        createdAt: { $gte: dateStart, $lt: dateEnd },
      },
    },
    {
      $group: {
        _id: null,
        total_revenue: { $sum: "$totalPrice" },
        // bookings_month: {
        //   $push: {
        //     each_order: "$totalPrice",
        //   },
        // },
      },
    },
  ]);
  res.status(200).json(data);
});
