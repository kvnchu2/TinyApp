const router = require("express").Router();
const { validate, generateRandomString, createObj, urlDatabase, users } = require('../helpers.js');
const bcrypt = require('bcrypt');



module.exports = () => {
  router.get("/register", (request, response) => {
    const user_id = request.session['user_id'];
    if (typeof user_id === 'undefined') {
      const templateVars = { urls: urlDatabase};
      response.render("urls_register", templateVars);
    } else {
      response.redirect('/urls');
    }
  });
  
  //validates email and password
  router.post("/register", (req, res) => {
    if (req.body.email === '' || req.body.password === '') {
      return res.status(400).send('input fields are blank');
    } else if (validate('email', req.body.email)) {
      return res.status(400).send('email already exists!');
    } else {
      const userID = generateRandomString();
      users[userID] = createObj('id', userID);
      users[userID]['email'] = req.body.email;
      users[userID]['password'] = bcrypt.hashSync(req.body.password, 10);
      req.session['user_id'] = userID;
      res.redirect('/urls');
    }
  });

  return router;
};