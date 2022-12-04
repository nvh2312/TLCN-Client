const express = require("express");
const orderController = require("./../controllers/orderController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.use(authController.protect);
router
  .route("/getTableOrder")
  .get(authController.restrictTo("admin"), orderController.getTableOrder);

router
  .route("/")
  .get(orderController.getAllOrders)
  .post(
    authController.restrictTo("user"),
    orderController.setUser,
    orderController.createOrder
  );
router.route("/count").get(orderController.countStatus);
router.route("/countOption").post(orderController.countStatusOption);
router.route("/sum").get(orderController.sumRevenue);
router.route("/sumOption").post(orderController.sumRevenueOption);
router.route("/topProduct").post(orderController.topProduct);
router.route("/statusInRange").post(orderController.countStatusInRange);
router.route("/topProductInRange").post(orderController.topProductInRange);
router.route("/sumInRange").post(orderController.sumInRange);
router
  .route("/:id")
  .get(orderController.isOwner, orderController.getOrder)
  .patch(
    orderController.isOwner,
    orderController.checkStatusOrder,
    orderController.updateOrder
  );

module.exports = router;
