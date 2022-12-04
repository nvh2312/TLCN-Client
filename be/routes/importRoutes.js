const express = require("express");
const importController = require("./../controllers/importController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.use(authController.protect);
authController.restrictTo("admin", "employee");
router.route("/getTableImport").get(importController.getTableImport);

router
  .route("/")
  .get(importController.getAllImports)
  .post(importController.setImporter, importController.createImport);
router.route("/sum").get(importController.sumImport);
router.route("/sumOption").post(importController.sumOption);
router.route("/sumInRange").post(importController.sumInRange);
router
  .route("/:id")
  .get(importController.getImport)
  .patch(importController.setImporter, importController.updateImport)
  .delete(importController.deleteImport);

module.exports = router;
