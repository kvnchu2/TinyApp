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

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

function createObj(ke, val) {
  const newObj = {};
  newObj[ke] = val;
  return newObj;
}

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
  const user_id = req.cookies['user_id'];
  const templateVars = { urls: urlDatabase, user: users[user_id]};
  console.log(templateVars);
  res.render("urls_index", templateVars);
});

//sends back html for hello
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/register", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"]};
  res.render("urls_register", templateVars);
})




app.post("/register", (req, res) => {
  const userID = generateRandomString();
  users[userID] = createObj('id', userID);
  users[userID]['email'] = req.body.email;
  users[userID]['password'] = req.body.password;
  console.log(users);
  res.cookie('user_id', userID);
  res.cookie('email',req.body.email);
  res.redirect('/urls');
})



app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
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