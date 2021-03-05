const router = require("express").Router();
const { validate, generateRandomString, createObj, urlDatabase, users } = require('../helpers.js');
const bcrypt = require('bcrypt');
const User = require('../models/User');


module.exports = () => {
  router.get("/register", (request, response) => {
    const user_id = request.session['user_id'];
    if (typeof user_id === 'undefined') {
      const templateVars = { urls: urlDatabase };
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
        return res.status(400).send('email already exists!');
      } else if (req.body.email === '' || req.body.password === '') {
        return res.status(400).send('input fields are blank');
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