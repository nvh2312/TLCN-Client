const Transaction = require("./../models/transactionModel");
const factory = require("./handlerFactory");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const moment = require("moment");

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

exports.createPaymentUrl = catchAsync(async (req, res, next) => {
  process.env.TZ = "Asia/Ho_Chi_Minh";

  let date = new Date();
  let createDate = moment(date).format("YYYYMMDDHHmmss");

  let ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  let tmnCode = process.env.vnp_TmnCode;
  let secretKey = process.env.vnp_HashSecret;
  let vnpUrl = process.env.vnp_Url;
  let returnUrl = process.env.vnp_ReturnUrl;
  let orderId = moment(date).format("DDHHmmss");
  let amount = req.body.amount;
  let bankCode = req.body.bankCode;
  let locale = process.env.vnp_Locale;
  let currCode = "VND";
  let vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = orderId;
  vnp_Params["vnp_OrderInfo"] = req.body.action;
  vnp_Params["vnp_OrderType"] = "other";
  vnp_Params["vnp_Amount"] = amount * 100;
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;
  if (bankCode && bankCode !== null && bankCode !== "") {
    vnp_Params["vnp_BankCode"] = bankCode;
  }
  vnp_Params = sortObject(vnp_Params);

  let querystring = require("qs");
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer.from(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
  res.status(201).json({
    status: "success",
    vnpUrl,
  });
});

exports.returnPaymentStatus = catchAsync(async (req, res, next) => {
  let vnp_Params = req.body.invoice;
  let secureHash = vnp_Params.vnp_SecureHash;
  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);

  let tmnCode = process.env.vnp_TmnCode;
  let secretKey = process.env.vnp_HashSecret;

  let querystring = require("qs");
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer.from(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    if (
      vnp_Params.vnp_ResponseCode === "00" &&
      vnp_Params.vnp_OrderInfo === "recharge"
    ) {
      const newRecord = {
        user: req.user,
        amount: Number(vnp_Params.vnp_Amount) / 100,
        payments: "vnpay",
        invoicePayment: vnp_Params,
      };
      await Transaction.create(newRecord);
    }
    res
      .status(201)
      .json({ message: "success", code: vnp_Params.vnp_ResponseCode, invoice: vnp_Params });
  } else {
    res.status(201).json({ message: "success", code: "97" });
  }
});

exports.returnPaypalStatus = catchAsync(async (req, res, next) => {
  const newRecord = {
    user: req.user,
    amount: req.body.amount,
    payments: "paypal",
    invoicePayment: req.body.invoicePayment,
  };
  await Transaction.create(newRecord);
  res.status(201).json({ message: "success" });
});

exports.getListPayments = factory.getAll(Transaction);
exports.setUser = catchAsync(async (req, res, next) => {
  if (req.user.role !== "admin") req.query.user = req.user.id;
  next();
});
