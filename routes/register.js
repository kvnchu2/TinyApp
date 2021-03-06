const router = require("express").Router();
const { validate, generateRandomString, createObj, urlDatabase } = require('../helpers.js');
const bcrypt = require('bcrypt');
const User = require('../models/User');


module.exports = () => {
  router.get("/register", (request, response) => {
    const user_id = request.session['user_id'];
    if (typeof user_id === 'undefined') {
      const templateVars = { warning: "none"};
      response.render("urls_register", templateVars);
    } else {
      response.redirect('/urls');
    }
  });
  
  //validates email and password
  router.post("/register", (req, res) => {

    const user = User.find({"email": req.body.email});
    user.exec().then((data) => {
      if (data.length > 0) {
        const templateVars = { warning: "exists"};
        res.render('urls_register', templateVars);
      } else if (req.body.email === '' || req.body.password === '') {
        const templateVars = { warning: "input"};
        res.render('urls_register', templateVars);
      } else {
        const userID = generateRandomString();
        req.session['user_id'] = userID;

        const { email, password } = req.body;
        let users = {};
        users.id = userID;
        users.email = email;
        users.password = bcrypt.hashSync(password, 10);
        let usersModel = new User(users);
        usersModel.save();
        res.redirect('/urls');
      }
    }).catch((err) => {
      console.log(err);
    });
  });

  return router;
};