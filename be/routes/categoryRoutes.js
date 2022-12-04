const express = require("express");
const categoryController = require("./../controllers/categoryController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.use(authController.protect);
router.route("/getTableCategory").get(authController.restrictTo("admin"),categoryController.getTableCategory);

router
  .route("/")
  .get(categoryController.getAllCategories)
  .post(
    authController.restrictTo("employee", "admin"),
    categoryController.createCategory
  );

router
  .route("/:id")
  .get(categoryController.getCategory)
  .patch(
    authController.restrictTo("employee", "admin"),
    categoryController.updateCategory
  )
  .delete(
    authController.restrictTo("employee", "admin"),
    categoryController.deleteCategory
  );

module.exports = router;
