const Location = require("./../models/locationModel");
const factory = require("./handlerFactory");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");

exports.getAllLocations = factory.getAll(Location);
exports.getLocation = factory.getOne(Location);

exports.nearestLocation = catchAsync(async (req, res, next) => {
  const { latitude, longitude } = req.query;
  const nearestLocationPromise = Location.findOne({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
      },
    },
  });

  const listLocationPromise = Location.find();
  const [nearestLocation, listLocation] = await Promise.all([
    nearestLocationPromise,
    listLocationPromise,
  ]);
  res.status(201).json({
    status: "success",
    data: {
      listLocation,
      nearestLocation,
    },
  });
});

exports.createLocation = catchAsync(async (req, res, next) => {
  const { name, address, latitude, longitude } = req.body;

  if (!address || !latitude || !longitude)
    return next(new AppError("Vui lòng cung cấp đầy đủ thông tin", 400));
  const newLocation = new Location({
    name,
    address,
    location: {
      coordinates: [longitude, latitude],
    },
  });

  await newLocation.save();
  res.status(201).json({
    status: "success",
    message: "Tạo mới địa chỉ thành công",
    data: {
      data: newLocation,
    },
  });
});
exports.updateLocation = catchAsync(async (req, res, next) => {
  const { name, address, latitude, longitude } = req.body;

  if (!address || !latitude || !longitude)
    return next(new AppError("Vui lòng cung cấp đầy đủ thông tin", 400));

  const updatedAddress = await Address.findByIdAndUpdate(
    id,
    {
      name,
      address,
      location: {
        coordinates: [longitude, latitude],
      },
    },
    { new: true, runValidators: true }
  );
  if (!updatedAddress) {
    return next(new AppError("Không tìm thấy địa chỉ này"), 404);
  }
  res.status(200).json({
    status: "success",
    message: "Cập nhật địa chỉ thành công",
    data: {
      data: updatedAddress,
    },
  });
});
exports.deleteLocation = factory.deleteOne(Location);

exports.getTableLocation = factory.getTable(Location);
