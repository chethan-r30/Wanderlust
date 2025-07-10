const express = require("express");
const router = express.Router();
const User = require("../models/user");
const WrapAsync = require("../utils/WrapAsync");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware");

const userController = require("../controllers/users");

router.get("/signup", userController.renderSignupForm);

router.post("/signup", WrapAsync(userController.signup));

router.get("/login", userController.renderLoginForm);

router.post(
  "/login",
  savedRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);

router.get("/logout", userController.logout);

module.exports = router;
