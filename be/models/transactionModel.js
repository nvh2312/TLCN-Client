const mongoose = require("mongoose");
const User = require("./userModel");

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Không thể để trống người nhận"],
    },
    amount: {
      type: Number,
      required: [true, "Không thể trống mục tiền nhận"],
      min: [1, "Tiền nhận phải lớn hơn 0"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    payments: {
      type: String,
      required: [true, "Phải có phương thức thanh toán"],
      enum: {
        values: ["vnpay", "paypal", "refund"],
        message: "Phải có phương thức nhận tiền",
      },
      default: "refund",
    },
    order: String,
    invoicePayment: Object,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

transactionSchema.statics.updateUserBalance = async function (userId, balance) {
  await User.findByIdAndUpdate(userId, { $inc: { balance: balance } });
};
transactionSchema.post("save", function () {
  this.constructor.updateUserBalance(this.user, this.amount);
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
