const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase  = {
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

//renders urls_new page
app.get("/urls/new", (req, res) => {
  const templateVars = {username: req.cookies["username"]}
  res.render("urls_new", templateVars);
});

//redirects user to longURL via hyperlink
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//renders urls_show page displaying short and long urls
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"]};
  console.log(templateVars);
  res.render("urls_show", templateVars);
});

//displays urlDatabase
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//renders urls_index page with long and short urls
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"]};
  res.render("urls_index", templateVars);
});

//sends back html for hello
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
})


app.post("/login", (req, res) => {
  res.cookie('username',req.body.username);
  console.log(req.body)
  // const templateVars = {
  //   username: req.cookies["username"],
  //   urls: urlDatabase,
    // ... any other vars
  //};
  res.redirect("/urls");
  
})

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  console.log(req);
  res.redirect(`/urls`);
})

//redirects to urls_show page from edit button on urls_index
// app.post("/urls/:shortURL/edit", (req, res) => {
//   const theShortUrl = req.params.shortURL
//   res.redirect(`/urls/${theShortUrl}`)
// })

//after user inputs url into edit field, they are redirected to urls_show
app.post("/urls/:id", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = req.params.id;
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls")
})

//after user inputs url, they are redirected to urls_show
app.post("/urls", (req, res) => {
  console.log(req.body);
  const shortURL = generateRandomString();
  urlDatabase[shortURL]= req.body.longURL; 
   // Log the POST request body to the console
  res.redirect(`/urls/${shortURL}`);        
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});