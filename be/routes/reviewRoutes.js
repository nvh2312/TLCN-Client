const express = require("express");
const reviewController = require("./../controllers/reviewController");
const authController = require("./../controllers/authController");

const router = express.Router({ mergeParams: true });


router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo("user"),
    reviewController.setProductUserIds,
    reviewController.createReview
  );
router.route("/getTableReview").get(reviewController.getTableReview);
router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(
    authController.protect,
    authController.restrictTo("user", "employee", "admin"),
    reviewController.isOwner,
    reviewController.updateReview
  )
  .delete(
    authController.protect,
    authController.restrictTo("user", "employee", "admin"),
    reviewController.isOwner,
    reviewController.deleteReview
  );

module.exports = router;
