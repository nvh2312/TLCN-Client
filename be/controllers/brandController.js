const Brand = require("./../models/brandModel");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
// const AppError = require("./../utils/appError");

exports.getTableBrand = factory.getTable(Brand);
exports.getAllBrands = factory.getAll(Brand);
exports.getBrand = factory.getOne(Brand);
exports.createBrand = factory.createOne(Brand);
exports.updateBrand = factory.updateOne(Brand);
exports.deleteBrand = factory.deleteOne(Brand);
