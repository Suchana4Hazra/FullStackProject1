const express = require("express");
const router = express.Router();
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../Controller/user.js")

router
  .route("/signup")
  .get( userController.getSignUpForm)
  .post( userController.submitSignUpForm);

router
   .route("/login")
   .get(userController.getLoginForm)
   .post(saveRedirectUrl, userController.submitLoginForm);

router.get("/logout", userController.getLogoutForm);

module.exports = router;
