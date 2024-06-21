require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bodyParser = require('body-parser');
const passport = require("passport");
const db = require("./config/database");
const authRoute = require("./routes/authRouter");

const app = express();

// Database connection
db.once("open", () => {
  console.log("Database connected successfully");
});
db.on("error", (err) => {
  console.error("Error connecting to database:", err.message);
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
}));

app.use(session({
  secret: "hibund",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
  },
}));

// Route yang memerlukan otentikasi
app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  });


app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
  next();
});

app.use("/auth", authRoute);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
