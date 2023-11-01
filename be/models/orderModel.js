const mongoose = require("mongoose");
const Transaction = require("./transactionModel");
const User = require("./userModel");
const io = require("../socket");


const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Hóa đơn phải có người mua"],
    },
    address: {
      type: String,
      required: [true, "Hóa đơn mua hàng phải có địa chỉ vận chuyển"],
    },
    receiver: {
      type: String,
      required: [true, "Hóa đơn mua hàng phải có thông tin người nhận"],
    },
    phone: {
      type: String,
      required: [true, "Hóa đơn mua hàng phải có số điện thoại người nhận"],
    },
    cart: [
      {
        product: Object,
        quantity: Number,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    totalPrice: Number,
    payments: {
      type: String,
      required: [true, "Phải có phương thức thanh toán"],
      enum: {
        values: ["tiền mặt", "paypal", "vnpay", "số dư"],
        message: "Phương thức thanh toán là tiền mặt hoặc ngân hàng",
      },
    },
    status: {
      type: String,
      enum: {
        values: [
          "Cancelled",
          "Processed",
          "Waiting Goods",
          "Delivery",
          "Success",
        ],
      },
      default: "Processed",
    },
    invoicePayment: Object,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

orderSchema.index({ "$**": "text" });

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name",
  });

  next();
});

orderSchema.statics.updateUserBalance = async function (userId, balance) {
  await User.findByIdAndUpdate(userId, { $inc: { balance: balance } });
  io.getIO().emit("purchase", {
    user: userId._id,
  });
};
orderSchema.post("save", function () {
  if (this.payments === "số dư")
    this.constructor.updateUserBalance(this.user, -this.totalPrice);
});

orderSchema.post("findOneAndUpdate", async function (doc) {
  if (doc.payments !== "tiền mặt" && doc.status === "Cancelled"){
    await Transaction.create({
      user: doc.user._id.toString(),
      amount: doc.totalPrice,
      payments: "refund",
      order: doc.id,
    });
    io.getIO().emit("recharge", {
      action: "refund",
      user: doc.user._id.toString(),
      amount: doc.totalPrice,
      order: doc.id,
    });
  }
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
