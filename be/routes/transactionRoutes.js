const express = require("express");
const transactionController = require("./../controllers/transactionController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.route("/create_payment_url").post(transactionController.createPaymentUrl);
router.route("/return_payment_status").post(transactionController.returnPaymentStatus);


module.exports = router;
