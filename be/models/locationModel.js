const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  name: String,
  address: {
    type:String,
    required: [true, "Không thể trống địa chỉ"],
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
  },
});

locationSchema.index({ location: "2dsphere" });

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;
