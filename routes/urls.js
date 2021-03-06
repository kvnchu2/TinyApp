const router = require("express").Router();
const { generateRandomString } = require('../helpers.js');
const Url = require('../models/Url');
const User = require('../models/User');

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
    const userLookup = User.find({ "id": user_id });
    userLookup.exec().then((data) => {
      if (data.length < 1) {
        res.redirect('/login');
      } else if (data.length > 0) {
        const templateVars = { user: data[0] };
        res.render("urls_new", templateVars);
      }
    });
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
    const userFind = User.aggregate([
      {
        $lookup:
          {
            from: "urls",
            localField: "id",
            foreignField: "userID",
            as: "url_docs"
          }
      }
    ]);
    userFind.exec().then((data) => {
      const url = data.filter(x => x['id'] === req.session['user_id'])[0].url_docs.filter(x => x.shortURL === req.params.shortURL)[0];
      const userInfo = data.filter(x => x['id'] === req.session['user_id'])[0];
      if (url) {
        const templateVars = { shortURL: url.shortURL, longURL: url.longURL, user: userInfo, owner: true};
        res.render("urls_show", templateVars);
      } else if (url === undefined) {
        const templateVars = { owner: false};
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
    if (req.session['user_id'] === undefined) {
      res.render("urls_index");
    } else if (req.session['user_id']) {
      const userFind = User.aggregate([
        {
          $lookup:
            {
              from: "urls",
              localField: "id",
              foreignField: "userID",
              as: "url_docs"
            }
        }
      ]);
      userFind.exec().then((data) => {
        const url = data.filter(x => x['id'] === req.session['user_id'])[0].url_docs;
        const userInfo = data.filter(x => x['id'] === req.session['user_id'])[0];
        const templateVars = { urls: url, user: userInfo};
        res.render("urls_index", templateVars);
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
    const urlEdit = Url.find({"userID": user_id, "shortURL": req.params.id});
    urlEdit.exec().then((data) => {
      if (data.length > 0) {
        const urlChange = Url.updateOne({"userID": user_id, "shortURL": req.params.id}, {"longURL": req.body.longURL});
        urlChange.exec();
        res.redirect("/urls");
      } else {
        return res.status(511).send('You do not have permission to edit');
      }
    });
  });
  
  //after user inputs url, they are redirected to urls_index
  router.post("/urls", (req, res) => {
    const user_id = req.session['user_id'];
    const shortURL = generateRandomString();
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



