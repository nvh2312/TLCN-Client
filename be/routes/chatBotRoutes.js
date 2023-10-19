const express = require("express");
const chatBotController = require("../controllers/chatBotController");
const router = express.Router();

router
  .route("/webhook")
  .get(chatBotController.getWebHook)
  .post(chatBotController.eventReceived);

module.exports = router;
