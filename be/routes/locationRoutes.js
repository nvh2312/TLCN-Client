const express = require("express");
const locationController = require("./../controllers/locationController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.route("/get-nearest-location").get(locationController.nearestLocation);
router.use(authController.protect);
router
  .route("/")
  .get(locationController.getAllLocations)
  .post(
    authController.restrictTo("employee", "admin"),
    locationController.createLocation
  );
router.route("/get-table-locations").get(locationController.getTableLocation);
router
  .route("/:id")
  .get(locationController.getLocation)
  .patch(
    authController.restrictTo("employee", "admin"),
    locationController.updateLocation
  )
  .delete(
    authController.restrictTo("employee", "admin"),
    locationController.deleteLocation
  );

module.exports = router;
