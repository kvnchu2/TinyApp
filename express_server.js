const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  var text = "";

  var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 6; i++ )
      text += charset.charAt(Math.floor(Math.random() * charset.length));

  return text;
}


app.get("/", (req, res) => {
  res.send("Hello!");
});

//deletes URL
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls`);
})


//after user inputs url, they are redirected to shortURL
app.post("/urls", (req, res) => {
  console.log(req.body);
  const shortKey = generateRandomString();
  urlDatabase[shortKey]= req.body.longURL; 
   // Log the POST request body to the console
  res.redirect(`/urls/${shortKey}`);        // Respond with 'Ok' (we will replace this)
});

//renders urls_new page
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//redirects user to longURL via hyperlink
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//renders urls_show page displaying short and long urls
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  console.log(templateVars);
  res.render("urls_show", templateVars);
});

//displays urlDatabase
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//renders urls_index page with long and short urls
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

//sends back html for hello
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});