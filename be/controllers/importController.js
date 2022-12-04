const Import = require("./../models/importModel");
const factory = require("./handlerFactory");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
exports.setImporter = (req, res, next) => {
  if (!req.user) return next(new AppError("Bạn không có quyền thực hiện"), 403);
  req.body.invoice = JSON.parse(req.body.invoice);
  req.body.user = req.user;
  next();
};

exports.getTableImport = factory.getTable(Import);
exports.createImport = factory.createOne(Import);
exports.getImport = factory.getOne(Import);
exports.getAllImports = factory.getAll(Import);
exports.updateImport = factory.updateOne(Import);
exports.deleteImport = factory.deleteOne(Import);
exports.sumImport = catchAsync(async (req, res, next) => {
  const data = await Import.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        total_month: { $sum: "$totalPrice" },
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
exports.sumOption = catchAsync(async (req, res, next) => {
  const option = {};
  if (req.body.year) option.year = { $year: "$createdAt" };
  if (req.body.month) option.month = { $month: "$createdAt" };
  if (req.body.week) option.week = { $week: "$createdAt" };
  if (req.body.date) option.date = { $dayOfWeek: "$createdAt" };

  const data = await Import.aggregate([
    {
      $group: {
        _id: option,
        total: { $sum: "$totalPrice" },
      },
    },
  ]);
  res.status(200).json(data);
});
exports.sumInRange = catchAsync(async (req, res, next) => {
  const option = {};
  const dateFrom = req.body.dateFrom;
  const dateTo = req.body.dateTo;
  let dateStart = new Date(dateFrom);
  dateStart;
  let dateEnd = new Date(dateTo);
  dateStart.setUTCHours(0, 0, 0, 0);
  dateEnd.setUTCHours(23, 59, 59, 999);
  dateStart.setTime(dateStart.getTime() + 14 * 60 * 60 * 1000);
  dateEnd.setTime(dateEnd.getTime() + 14 * 60 * 60 * 1000);
  const data = await Import.aggregate([
    {
      $match: {
        createdAt: { $gte: dateStart, $lt: dateEnd },
      },
    },
    {
      $group: {
        _id: option,
        total: { $sum: "$totalPrice" },
      },
    },
  ]);
  res.status(200).json(data);
});
