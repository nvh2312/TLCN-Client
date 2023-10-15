const express = require("express");
const transactionController = require("./../controllers/transactionController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.route("/create_payment_url").post(transactionController.createPaymentUrl);
router.route("/return_payment_status").post(transactionController.returnPaymentStatus);
router.route("/return_paypal_status").post(transactionController.returnPaypalStatus);
router.route("/get-all-payments").get(transactionController.setUser,transactionController.getListPayments);


module.exports = router;
