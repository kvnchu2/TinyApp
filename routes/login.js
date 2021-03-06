const router = require("express").Router();
const { validate, getUserByEmail, users } = require('../helpers.js');
const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = () => {
  router.get("/login", (request, response) => {
    const user_id = request.session['user_id'];
    if (typeof user_id === 'undefined') {
      response.render("login");
    } else {
      response.redirect('/urls');
    }
  });


  //validates email and password against database
  router.post("/login", (req, res) => {
    const user = User.find({"email": req.body.email});
    user.exec().then((data) => {
      if (data.length < 1) {
        return res.status(403).send('forbidden');
      } else if (data.length > 0 && !bcrypt.compareSync(req.body.password, data[0].password)) {
        return res.status(403).send('password does not match');
      } else if (data.length > 0 && bcrypt.compareSync(req.body.password, data[0].password)) {
        req.session['user_id'] = data[0].id;
        res.redirect('/urls');
      }
    }).catch((err) => {
      console.log(err);
    });
  });

  //clears cookie session and redirects back to urls page
  router.post("/logout", (req, res) => {
    req.session = null;
    res.redirect('/urls');
  });

  return router;
};


