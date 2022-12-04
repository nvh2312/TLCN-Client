const mongoose = require("mongoose");
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nhãn hiệu phải có tên"],
      unique: true,
      trim: true,
      maxlength: [
        40,
        "Nhãn hiệu tối đa 40 kí tự",
      ],
      minlength: [2, "Nhãn hiệu tối thiểu 2 kí tự"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const brand = mongoose.model("Brand", brandSchema);

module.exports = brand;
