const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const {
  createContact,
  loginForm,
  saveLogin,
  logout,
} = require("../controllers/contacts");

router
  .route("/register")
  // render registration form - transfer frontend
  // .get(registerForm)
  // SAVE REGISTER INFO
  .post(catchAsync(createContact));

router
  .route("/login")
  // render login form - transfer frontend
  // .get(loginForm)
  // save login
  .post(passport.authenticate("local", { failureMessage: true }), saveLogin);

router.get("/logout", logout);

module.exports = router;
