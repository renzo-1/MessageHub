module.exports.sessionConfig = {
  name: "MessageHub",
  secret: "AiWEm329aK2!!-",
  resave: false,
  saveUninitialized: false,
  cookie: {
    // secure: true,
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
