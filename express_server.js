const express = require("express");
const app = express();
const PORT = process.env.PORT || 8081; // default port 8080
const cookieSession = require('cookie-session');
const connectDB = require('./db/Connection');
const mongoose = require("mongoose");
require('dotenv/config');


app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({
  name: 'session',
  keys: ['key1','key2'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

connectDB();

app.use(express.static(__dirname + '/public'));
app.use(express.json({extended: false}));
// seperated routes
const login = require("./routes/login");
const register = require("./routes/register");
const urls = require("./routes/urls");

app.use("/", login());
app.use("/", register());
app.use("/", urls());


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});