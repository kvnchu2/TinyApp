const router = require("express").Router();
const { urlDatabase, users, isOwner, urlsForUser, generateRandomString, createObj } = require('../helpers.js');
const Url = require('../models/Url');

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
      const templateVars = {user: user_id};
      res.render("urls_new", templateVars);
    }
  });

  //redirects user to longURL via hyperlink
  router.get("/u/:shortURL", (req, res) => {
    const longUrl = Url.find({"userID": req.session['user_id'], "shortURL": req.params.shortURL});
    longUrl.exec().then((data) => {
      res.redirect(data[0].longURL);
    }).catch((err) => {
      console.log(err);
    });
  });

  //renders urls_show page displaying short and long urls
  router.get("/urls/:shortURL", (req, res) => {
    const user = Url.find({"userID": req.session['user_id'], "shortURL": req.params.shortURL});
    user.exec().then((data) => {
      if (data.length > 0) {
        const templateVars = { shortURL: req.params.shortURL, longURL: data[0].longURL, owner: true};
        res.render("urls_show", templateVars);
      } else {
        const templateVars = { shortURL: req.params.shortURL, longURL: data[0].longURL, owner: false};
        res.render("urls_show", templateVars);
      }
    }).catch((err) => {
      console.log(err);
    });
  });

  //displays urlDatabase
  router.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
  });

  //renders urls_index page with long and short urls
  router.get("/urls", (req, res) => {
    if (!req.session['user_id']) {
      const templateVars = {user: 'undefined'};
      res.render("urls_index", templateVars);
    } else if (req.session['user_id']) {
      const urlFind = Url.find({"userID": req.session['user_id']});
      urlFind.exec().then((data) => {
        let urlDatabase = {};
        data.forEach(x => urlDatabase[x.shortURL] = x.longURL);
        const templateVars = {urls: urlDatabase, user: req.session['user_id']};
        res.render("urls_index", templateVars);
      }).catch((err) => {
        console.log(err);
      });
    }

  });

  //deletes URL from database or returns error message if userID doesn't match
  router.post("/urls/:shortURL/delete", (req, res) => {
    const urlFind = Url.find({"userID": req.session['user_id'], "shortURL": req.params.shortURL});
    urlFind.exec().then((data) => {
      if (data.length > 0) {
        const urlRemove = Url.remove({"shortURL": req.params.shortURL, "userID": req.session['user_id']});
        urlRemove.exec();
        res.redirect(`/urls`);
      } else {
        return res.status(511).send('You do not have permission to delete');
      }
    }).catch((err) => {
      console.log(err);
    });

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
    // urlDatabase[shortURL] = createObj('longURL',req.body.longURL);
    // urlDatabase[shortURL]['userID'] = user_id;

    const { longURL } = req.body;
    let urls = {};
    urls.shortURL = shortURL;
    urls.longURL = longURL;
    urls.userID = user_id;
    
    let urlModel = new Url(urls);
    urlModel.save();
    res.redirect(`/urls/${shortURL}`);
  });

  return router;
};



