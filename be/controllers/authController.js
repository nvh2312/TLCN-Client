const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const { connect } = require("getstream");
const User = require("./../models/userModel");
const Review = require("./../models/reviewModel");
const Order = require("./../models/orderModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const sendEmail = require("./../utils/email");

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID;

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const changeState = async (user, state, statusCode, res) => {
  user.active = state;
  const message = "Cập nhật trạng thái user thành công!!!";
  await user.save({ validateBeforeSave: false });
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    data: {
      user,
    },
    message,
  });
};
exports.changeStateUser = catchAsync(async (req, res, next) => {
  // 1) get token from cookie and state update to user
  const token = req.cookies.jwt;
  const state = req.body.state;
  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }
  changeState(currentUser, state, 200, res);
});
const createSendToken = async (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);
  res.locals.user = user;

  // Remove password from output
  user.password = undefined;

  const serverClient = connect(api_key, api_secret, app_id);
  const tokenStream = serverClient.createUserToken(user.id);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
    tokenStream,
  });
};

const sendVerifyToken = catchAsync(async (user, statusCode, res) => {
  // 1) create token to verify
  const verifyToken = user.createVerifyToken();
  await user.save({ validateBeforeSave: false });
  // 2) create cookie to client
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);
  // 3) Send it to user's email
  const verifyURL = `https://hctech.onrender.com/verify`;
  const message = `Bạn là chủ tài khoản? Vui lòng xác nhận tài khoản tại:  ${verifyURL}.\nMã xác nhận: ${verifyToken}\n.Nếu không phải, vui lòng bỏ qua mail này!`;
  user.password = undefined;
  try {
    await sendEmail({
      email: user.email,
      subject: "verify User",
      message,
    });
    res.status(statusCode).json({
      status: "success",
      token,
      data: {
        user,
      },
      message: "Token sent to email!",
    });
  } catch (err) {
    console.log(err);
  }
});

exports.verifyUser = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.body.encode)
    .digest("hex");
  console.log(hashedToken);
  const user = await User.findOne({
    userVerifyToken: hashedToken,
  });
  console.log(user);
  // 2) If token true, verify this user
  if (!user) {
    return next(new AppError("Mã xác nhận không hợp lệ hoặc đã hết hạn", 400));
  }
  user.active = "active";
  user.userVerifyToken = undefined;
  await user.save({ validateBeforeSave: false });

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
});

exports.signup = catchAsync(async (req, res, next) => {
  const userExist = await User.find({ email: req.body.email });
  console.log(JSON.stringify(userExist));
  if (JSON.stringify(userExist) != "[]") {
    return next(new AppError("Email này đã được đăng ký.", 500));
  }
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  sendVerifyToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Vui lòng cung cấp email và mật khẩu!", 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");

  if (
    !user ||
    !(await user.correctPassword(password.toString(), user.password))
  ) {
    return next(new AppError("Email hoặc mật khẩu không chính xác", 401));
  }
  // 3) Check if user not verify, send code to gmail
  if (user.active == "verify") {
    sendVerifyToken(user, 201, res);
  }

  // 4) If everything ok, send token to client
  else {
    createSendToken(user, 200, res);
  }
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
  } catch (error) {
    return next(
      new AppError(
        "Bạn chưa đăng nhập hoặc đăng ký. Vui lòng thực hiện!!!",
        401
      )
    );
  }
  // console.log(req.cookies.jwt);
  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError("Token người dùng không còn tồn tại.", 401));
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        "Tài khoản gần đây đã thay đổi mật khẩu! Xin vui lòng đăng nhập lại.",
        401
      )
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }
      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'employee',[user]]. role='user'
    if (req.user == undefined || !roles.includes(req.user.role)) {
      return next(new AppError("Bạn không có quyền thực hiện", 403));
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError(
        "Tài khoản này không tồn tại. Vui lòng đăng ký để sử dụng",
        404
      )
    );
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/forgot-password`;

  const message = `Bạn quên mật khẩu? Mã xác nhận của bạn: ${resetToken}.\nĐổi mật khẩu mới tại : ${resetURL}.\nNếu không phải bạn, vui lòng bỏ qua email này!`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    console.log(err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "Đã có lỗi xảy ra trong quá trình gửi mail. Vui lòng thực hiện lại sau!"
      ),
      500
    );
  }
});
exports.verifyResetPass = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.body.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError("Token không hợp lệ hoặc đã hết hạn", 400));
  }
  res.status(200).json({
    status: "success",
    hashedToken,
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const user = await User.findOne({
    passwordResetToken: req.params.token,
    passwordResetExpires: { $gt: Date.now() },
  });
  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError("oken không hợp lệ hoặc đã hết hạn", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select("+password");

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Mật khẩu hiện tại chưa chính xác.", 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

exports.googleLogin = catchAsync(async (req, res) => {
  const email = req.body.email;
  // 1) Check if user exists
  const data = await User.findOne({ email });
  // 2) Check if user exist
  if (data.role == "admin") {
    createSendToken(data, 200, res);
  }
  // 3) If user does not exist, create one
  else {
    res.status(400).json({ message: "Tài khoản này không được phép truy cập" });
  }
});
exports.userLoginWith = catchAsync(async (req, res, next) => {
  const { email, displayName, emailVerified } = req.body.user;
  // 1) Check if user exists
  const data = await User.findOne({ email });
  // 2) Check if user does not exist, create one and send token
  if (!data) {
    const password = email + process.env.JWT_SECRET;
    const inform = {
      email,
      password,
      passwordConfirm: password,
      name: displayName,
      active: "active",
    };
    const newUser = await User.create(inform);
    createSendToken(newUser, 200, res);
  }
  // 3) If user exist
  else {
    if (data.active == "ban")
      return next(new AppError("Tài khoản của bạn đã bị ban.", 401));
    if (data.active == "verify") {
      data.active = "active";
      await data.save({ validateBeforeSave: false });
    }
    createSendToken(data, 200, res);
  }
});
