const Product = require("./../models/productModel");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("./../utils/appError");
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const multer = require("multer");

const uploadFiles = upload.fields([{ name: "images", maxCount: 5 }]);
exports.uploadProductImages = (req, res, next) => {
  uploadFiles(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return next(
          new AppError("Vượt quá số lượng file quy định.", 400),
          false
        );
      }
    } else if (err) {
      return next(new AppError("Upload thất bại.", 400), false);
    }
    if (req.body.promotion == "") req.body.promotion = req.body.price;
    next();
  });
};

exports.resizeProductImages = catchAsync(async (req, res, next) => {
  if (req.files === undefined || !req.files.images) return next();
  req.body.images = [];
  // await Promise.all(
  // req.files.images.map(async (file, i) => {
  for (const file of req.files.images) {
    const result = await cloudinary.uploader.upload(file.path);
    req.body.images.push(result.url);
  }
  // );
  next();
});
exports.deleteImageCloud = catchAsync(async (req, res, next) => {
  if (
    req.body.action == "Edit" &&
    (req.files === undefined || !req.files.images)
  )
    return next();
  let product = await Product.findById(req.params.id);

  // Delete image from cloudinary
  await product.images.forEach(async (imageURL) => {
    const getPublicId = imageURL.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(getPublicId);
  });

  next();
});
exports.aliasTopProducts = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,priceDiscount,ratingsAverage,title";
  next();
};
exports.getAllProducts = factory.getAll(Product);
exports.getProduct = factory.getOne(Product, { path: "reviews" });
exports.createProduct = factory.createOne(Product);
exports.updateProduct = factory.updateOne(Product);
exports.deleteProduct = factory.deleteOne(Product);

exports.getTableProduct = factory.getTable(Product);
