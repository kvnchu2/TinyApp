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
};

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

//used for obtaining ID from from database using email provided
const getUserByEmail = function (email, database) {
  for (let user in database) {
    if (database[user]['email'] === email) {
      return database[user]['id'];
    }
  }
};

//used for login validation
const validate = function(key, item) {
  const usersArr = Object.keys(users);
  for (let user of usersArr) {
    if (users[user][key] === item) {
      return true;
    }
  }
  return false;
};

//generates random 6 character alphanumeric
const generateRandomString = function() {
  let text = "";

  const charset = "abcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 6; i++) {
    text += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return text;
};

//used to add object to userID in users
const createObj = function(ke, val) {
  const newObj = {};
  newObj[ke] = val;
  return newObj;
};

//used for getting the urls for user id
const urlsForUser = function(id) {
  let userObj = {};
  for (let user in urlDatabase) {
    if (urlDatabase[user]['userID'] === id) {
      userObj[user] = urlDatabase[user]['longURL'];
    }
  }
  return userObj;
};

//used for validating if user is owner of shortURL
const isOwner = function(shortURL, userID) {
  if (urlDatabase[shortURL]['userID'] === userID) {
    return true;
  }
  return false;
};


module.exports = { urlsForUser, isOwner, getUserByEmail, validate, generateRandomString, createObj, users, urlDatabase };