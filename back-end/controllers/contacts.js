const Contact = require("../models/contactModel");
const sanitize = require("sanitize-html");
const ExpressError = require("../utils/ExpressErrors");

// SAVE REGISTER INFO
module.exports.createContact = async (req, res, next) => {
  const { username, password } = req.body;
  const sanitizedUsername = sanitize(username);
  if (sanitizedUsername.length === 0) {
    throw new ExpressError("Invalid Username", 400);
  }
  const contact = new Contact({ username: sanitizedUsername });
  const registeredContact = await Contact.register(contact, password);
  req.login(registeredContact, (err) => {
    if (err) return next(err);
    return res.status(200).json({ message: "Success" });
  });
};

// SAVE LOGIN
module.exports.saveLogin = async (req, res) => {
  return res.status(200).json({ message: "Success" });
};

// SAVE LOGOUT
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.status(200).json({ message: "Success" });
  });
};
