const router = require("express").Router();
const { urlDatabase, users, isOwner, urlsForUser, generateRandomString, createObj } = require('../helpers.js');

module.exports = () => {
  //home page
  router.get("/", (req, res) => {
    const user_id = req.session['user_id'];
    if (typeof user_id === 'undefined') {
      res.redirect('/login');
    } else {
      res.redirect('urls');
    }
  });

  //renders urls_new page
  router.get("/urls/new", (req, res) => {
    const user_id = req.session['user_id'];
    if (typeof user_id === 'undefined') {
      res.redirect('/login');
    } else {
      const templateVars = {user: users[user_id]};
      res.render("urls_new", templateVars);
    }
  });

  //redirects user to longURL via hyperlink
  router.get("/u/:shortURL", (req, res) => {
    const longURL = urlDatabase[req.params.shortURL]['longURL'];
    res.redirect(longURL);
  });

  //renders urls_show page displaying short and long urls
  router.get("/urls/:shortURL", (req, res) => {
    const user_id = req.session['user_id'];
    const isOwnerVar = isOwner(req.params.shortURL, user_id);
    const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]['longURL'], user: users[user_id], owner: isOwnerVar};
    res.render("urls_show", templateVars);
  });

  //displays urlDatabase
  router.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
  });

  //renders urls_index page with long and short urls
  router.get("/urls", (req, res) => {
    const user_id = req.session['user_id'];
    const newUrlDatabase = urlsForUser(user_id);
    const templateVars = { urls: newUrlDatabase, user: users[user_id]};
    res.render("urls_index", templateVars);
  });

  //deletes URL from database or returns error message if userID doesn't match
  router.post("/urls/:shortURL/delete", (req, res) => {
    const user_id = req.session['user_id'];
    const newUrlDatabase = urlsForUser(user_id);
    if (urlDatabase[req.params.shortURL]['userID'] === user_id) {
      delete urlDatabase[req.params.shortURL];
      res.redirect(`/urls`);
    } else {
      return res.status(511).send('You do not have permission to delete');
    }
  });
  
  
  //after user inputs url into edit field, they are redirected to urls_show
  router.post("/urls/:id", (req, res) => {
    const user_id = req.session['user_id'];
    const newUrlDatabase = urlsForUser(user_id);
    if (urlDatabase[req.params.id]['userID'] === user_id) {
      const longURL = req.body.longURL;
      const shortURL = req.params.id;
      urlDatabase[shortURL].longURL = longURL;
      res.redirect("/urls");
    } else {
      return res.status(511).send('You do not have permission to edit');
    }
  });
  
  //after user inputs url, they are redirected to urls_index
  router.post("/urls", (req, res) => {
    const user_id = req.session['user_id'];
    const shortURL = generateRandomString();
    urlDatabase[shortURL] = createObj('longURL',req.body.longURL);
    urlDatabase[shortURL]['userID'] = user_id;
    res.redirect(`/urls/${shortURL}`);
  });

  return router;
};



