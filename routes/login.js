const router = require("express").Router();
const { validate, getUserByEmail, users } = require('../helpers.js');
const bcrypt = require('bcrypt');

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
    const userID = getUserByEmail(req.body.email, users);
    if (!validate('email', req.body.email)) {
      return res.status(403).send('forbidden');
    } else if (validate('email', req.body.email) === true && !bcrypt.compareSync(req.body.password, users[userID]['password'])) {
      return res.status(403).send('password does not match');
    } else if (validate('email', req.body.email) === true && bcrypt.compareSync(req.body.password, users[userID]['password']) === true) {
      req.session['user_id'] = userID;
      res.redirect('/urls');
    }
  });


  //clears cookie session and redirects back to urls page
  router.post("/logout", (req, res) => {
    req.session = null;
    res.redirect('/urls');
  });

  return router;
};


