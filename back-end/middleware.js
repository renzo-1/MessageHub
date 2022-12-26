const ExpressError = require("./utils/ExpressErrors");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    throw new ExpressError("You must be signed in", 402);
    // return res.status(401).json({message: 'You must be signed in'})
  }
  next();
};
