module.exports.sessionConfig = {
  name: "MessageHub",
  secret: "yoursecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    // secure: true,
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
