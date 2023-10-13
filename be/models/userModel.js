const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Vui lòng cung cấp tên!"],
  },
  email: {
    type: String,
    required: [true, "Vui lòng cung cấp email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Vui lòng cung cấp mail chính xác"],
  },
  avatar: {
    type: String,
    default:
      "https://png.pngtree.com/png-clipart/20200701/original/pngtree-default-avatar-png-image_5407175.jpg",
  },
  role: {
    type: String,
    enum: ["user", "employee", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Tài khoản cần có mật khẩu"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Vui lòng nhập lại mật khẩu"],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: "Nhập lại mật khẩu chưa đúng!",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  address: [
    {
      name: String,
      phone: String,
      province: String,
      district: String,
      ward: String,
      detail: String,
      setDefault: {
        type: Boolean,
        default: false,
      },
    },
  ],
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  userVerifyToken: String,
  active: {
    type: String,
    enum: ["active", "verify", "ban"],
    default: "verify",
  },
  dateOfBirth: String,
  gender: String,
  phone: String,
  balance: {
    type: Number,
    default: 0,
  },
});
userSchema.index({'$**': 'text'});

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// userSchema.pre(/^find/, function (next) {
//   // this points to the current query
//   // this.find({ active: { $ne: "ban" } });
//   next();
// });

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  const result = await bcrypt.compare(candidatePassword, userPassword);
  return result;
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(3).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
userSchema.methods.createVerifyToken = function () {
  const verifyToken = crypto.randomBytes(3).toString("hex");

  this.userVerifyToken = crypto
    .createHash("sha256")
    .update(verifyToken)
    .digest("hex");

  console.log({ verifyToken }, this.userVerifyToken);

  return verifyToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
