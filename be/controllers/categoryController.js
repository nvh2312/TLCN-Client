const Category = require("./../models/categoryModel");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
// const AppError = require("./../utils/appError");

exports.getTableCategory = factory.getTable(Category);
exports.getAllCategories = factory.getAll(Category);
exports.getCategory = factory.getOne(Category);
exports.createCategory = factory.createOne(Category);
exports.updateCategory = factory.updateOne(Category);
exports.deleteCategory = factory.deleteOne(Category);
