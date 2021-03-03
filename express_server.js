const express = require("express");
const app = express();
const PORT = 8081; // default port 8080
const cookieSession = require('cookie-session');

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({
  name: 'session',
  keys: ['key1','key2'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

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