// only require dotenv if development stage
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const port = process.env.PORT || 3000;
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const ExpressError = require("./utils/ExpressErrors");
const cors = require("cors");
const corsOptions = require("./configs/corsOptions");
const http = require("http");
const server = http.createServer(app);
const { sessionConfig } = require("./configs/session");
const Contact = require("./models/contactModel");

// connect to mongoose
mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log("Connection Open");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cors(corsOptions));
app.use(methodOverride("_method"));

// HTML path config
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// public path config
app.use(express.static(path.join(__dirname, "public")));

// request data encoder
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// session config
app.use(session(sessionConfig));

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("joinRoom", (room) => {
    socket.join(room);
    // console.log("welcome", `A New User Joined at : ${room}`);
  });

  socket.on("leaveRoom", (room) => socket.leave(room));

  socket.on("sendMessage", ({ res, id }) => {
    io.to(id).emit("newMessage", res);
  });
});

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Contact.authenticate()));
passport.serializeUser(Contact.serializeUser());
passport.deserializeUser(Contact.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// ROUTERS
app.use("/api/convo", require("./routes/convos"));
app.use("/api/convo/:id/message", require("./routes/messages"));
app.use("/api", require("./routes/contacts"));

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no, someting went wrong!";
  res.status(statusCode).json({ message: `${err}` });
});

server.listen(port, () =>
  console.log(`Server is up and running on port ${port}...`)
);
